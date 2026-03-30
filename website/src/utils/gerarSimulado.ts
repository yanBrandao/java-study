import type { Question } from '../types/questions';

type PdfContent = any;

/**
 * Converte texto inline com **bold**, *italic* e `code` em array pdfmake.
 */
function parseInline(texto: string): PdfContent[] {
  const resultado: PdfContent[] = [];
  // Regex para capturar: **bold**, *italic*, `code`
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(texto)) !== null) {
    // Texto antes do match
    if (match.index > lastIndex) {
      resultado.push({ text: texto.slice(lastIndex, match.index) });
    }

    if (match[2]) {
      // **bold**
      resultado.push({ text: match[2], bold: true });
    } else if (match[3]) {
      // *italic*
      resultado.push({ text: match[3], italics: true });
    } else if (match[4]) {
      // `code`
      resultado.push({
        text: match[4],
        fontSize: 9,
        background: '#f0f0f0',
        color: '#c7254e',
      });
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < texto.length) {
    resultado.push({ text: texto.slice(lastIndex) });
  }

  return resultado.length > 0 ? resultado : [{ text: texto }];
}

/**
 * Converte markdown da resposta em conteúdo pdfmake estilizado.
 */
function markdownParaPdf(markdown: string): PdfContent[] {
  const conteudo: PdfContent[] = [];
  const linhas = markdown.split('\n');
  let i = 0;

  while (i < linhas.length) {
    const linha = linhas[i];

    // Ignorar tags de avaliação [Correto], [Parcial], etc.
    if (/^\*\*\[(Correto|Parcial|Incorreto|Não respondida)\]\*\*/.test(linha.trim())) {
      i++;
      continue;
    }

    // Remover prefixo R: da primeira linha
    const linhaSemR = linha.replace(/^R:\s*/, '');

    // Bloco de código ```
    if (linhaSemR.trim().startsWith('```')) {
      const codeLines: string[] = [];
      i++; // pular a linha ```
      while (i < linhas.length && !linhas[i].trim().startsWith('```')) {
        codeLines.push(linhas[i]);
        i++;
      }
      i++; // pular o ``` de fechamento

      if (codeLines.length > 0) {
        conteudo.push({
          table: {
            widths: ['*'],
            body: [[{
              text: codeLines.join('\n'),
              fontSize: 8.5,
              lineHeight: 1.3,
              color: '#1a1a2e',
              margin: [8, 8, 8, 8],
            }]],
          },
          layout: {
            fillColor: () => '#f6f8fa',
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            hLineColor: () => '#e1e4e8',
            vLineColor: () => '#e1e4e8',
            paddingLeft: () => 0,
            paddingRight: () => 0,
            paddingTop: () => 0,
            paddingBottom: () => 0,
          },
          margin: [0, 4, 0, 6],
        });
        continue;
      }
    }

    // Tabela markdown (linhas com |)
    if (linhaSemR.trim().startsWith('|') && linhaSemR.trim().endsWith('|')) {
      const tabelaLinhas: string[][] = [];
      while (i < linhas.length && linhas[i].trim().startsWith('|') && linhas[i].trim().endsWith('|')) {
        const raw = linhas[i].trim();
        // Ignorar linha separadora (|---|---|)
        if (/^\|[-:\s|]+\|$/.test(raw)) {
          i++;
          continue;
        }
        const celulas = raw
          .slice(1, -1) // remover | externo
          .split('|')
          .map((c) => c.trim());
        tabelaLinhas.push(celulas);
        i++;
      }

      if (tabelaLinhas.length > 0) {
        const numCols = Math.max(...tabelaLinhas.map((r) => r.length));
        const body = tabelaLinhas.map((row, rowIdx) => {
          const cells = [];
          for (let c = 0; c < numCols; c++) {
            cells.push({
              text: row[c] || '',
              fontSize: 9,
              bold: rowIdx === 0,
              color: rowIdx === 0 ? '#2e8555' : '#333333',
              margin: [4, 3, 4, 3],
            });
          }
          return cells;
        });

        conteudo.push({
          table: {
            headerRows: 1,
            widths: Array(numCols).fill('*'),
            body,
          },
          layout: {
            fillColor: (rowIndex: number) => (rowIndex === 0 ? '#f0f7f4' : null),
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.3,
            hLineColor: () => '#d0d7de',
            vLineColor: () => '#d0d7de',
          },
          margin: [0, 4, 0, 6],
        });
        continue;
      }
    }

    // Lista com - ou *
    if (/^\s*[-*]\s+/.test(linhaSemR)) {
      const itens: PdfContent[] = [];
      while (i < linhas.length) {
        const itemLinha = linhas[i].replace(/^R:\s*/, '');
        if (!/^\s*[-*]\s+/.test(itemLinha)) break;
        const textoItem = itemLinha.replace(/^\s*[-*]\s+/, '');
        itens.push({ text: parseInline(textoItem), style: 'resposta' });
        i++;
      }
      conteudo.push({
        ul: itens,
        margin: [0, 2, 0, 4],
        style: 'resposta',
      });
      continue;
    }

    // Linha vazia
    if (linhaSemR.trim() === '') {
      i++;
      continue;
    }

    // Parágrafo normal com formatação inline
    conteudo.push({
      text: parseInline(linhaSemR),
      style: 'resposta',
      margin: [0, 0, 0, 4],
    });
    i++;
  }

  return conteudo;
}

export async function gerarSimuladoPDF(
  perguntasSelecionadas: Question[],
): Promise<void> {
  const pdfMake = await import('pdfmake/build/pdfmake');
  const pdfFonts = await import('pdfmake/build/vfs_fonts');

  pdfMake.default.vfs = pdfFonts.default.pdfMake?.vfs ?? pdfFonts.default.vfs;

  pdfMake.default.fonts = {
    Roboto: {
      normal: 'Roboto-Regular.ttf',
      bold: 'Roboto-Medium.ttf',
      italics: 'Roboto-Italic.ttf',
      bolditalics: 'Roboto-MediumItalic.ttf',
    },
  };

  const dataAtual = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const totalPerguntas = perguntasSelecionadas.length;

  const contagemCategorias = new Map<string, number>();
  for (const p of perguntasSelecionadas) {
    contagemCategorias.set(p.category, (contagemCategorias.get(p.category) || 0) + 1);
  }

  const resumoCategorias = Array.from(contagemCategorias.entries())
    .map(([cat, qtd]) => `${cat}: ${qtd}`)
    .join('  •  ');

  // --- Seção de perguntas ---
  const secaoPerguntas: PdfContent[] = [
    {
      text: 'SIMULADO - ENTREVISTA JAVA',
      style: 'titulo',
      alignment: 'center',
    },
    {
      text: `Data: ${dataAtual}  •  ${totalPerguntas} questões`,
      style: 'subtitulo',
      alignment: 'center',
      margin: [0, 5, 0, 5],
    },
    {
      text: resumoCategorias,
      style: 'categoriaResumo',
      alignment: 'center',
      margin: [0, 0, 0, 20],
    },
    {
      canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#2e8555' }],
      margin: [0, 0, 0, 20],
    },
    {
      text: 'PERGUNTAS',
      style: 'secaoTitulo',
      margin: [0, 0, 0, 15],
    },
  ];

  for (let i = 0; i < perguntasSelecionadas.length; i++) {
    const p = perguntasSelecionadas[i];
    secaoPerguntas.push({
      columns: [
        { text: `${i + 1}.`, width: 25, style: 'numeroPergunta' },
        {
          stack: [
            { text: p.question, style: 'pergunta' },
            { text: `[${p.category} — ${p.sourceTitle}]`, style: 'categoriaPergunta' },
          ],
        },
      ],
      margin: [0, 0, 0, 12],
    });
  }

  // --- Seção de respostas (gabarito) ---
  const secaoRespostas: PdfContent[] = [
    { text: '', pageBreak: 'before' },
    {
      canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#2e8555' }],
      margin: [0, 0, 0, 20],
    },
    {
      text: 'GABARITO',
      style: 'secaoTitulo',
      margin: [0, 0, 0, 15],
    },
  ];

  for (let i = 0; i < perguntasSelecionadas.length; i++) {
    const p = perguntasSelecionadas[i];
    const respostaConteudo = markdownParaPdf(p.answer);

    secaoRespostas.push({
      stack: [
        {
          columns: [
            { text: `${i + 1}.`, width: 25, style: 'numeroPergunta' },
            { text: p.question, style: 'perguntaGabarito' },
          ],
        },
        {
          stack: respostaConteudo,
          margin: [25, 5, 0, 0],
        },
        {
          canvas: [{ type: 'line', x1: 0, y1: 0, x2: 490, y2: 0, lineWidth: 0.3, lineColor: '#e0e0e0' }],
          margin: [0, 8, 0, 0],
        },
      ],
      margin: [0, 0, 0, 15],
    });
  }

  const docDefinition: any = {
    pageSize: 'A4',
    pageMargins: [40, 40, 40, 40],
    defaultStyle: {
      font: 'Roboto',
    },
    content: [...secaoPerguntas, ...secaoRespostas],
    styles: {
      titulo: {
        fontSize: 20,
        bold: true,
        color: '#2e8555',
      },
      subtitulo: {
        fontSize: 11,
        color: '#555555',
      },
      categoriaResumo: {
        fontSize: 9,
        color: '#888888',
      },
      secaoTitulo: {
        fontSize: 16,
        bold: true,
        color: '#2e8555',
      },
      numeroPergunta: {
        fontSize: 11,
        bold: true,
        color: '#2e8555',
      },
      pergunta: {
        fontSize: 11,
        lineHeight: 1.3,
      },
      categoriaPergunta: {
        fontSize: 8,
        color: '#999999',
        italics: true,
        margin: [0, 2, 0, 0],
      },
      perguntaGabarito: {
        fontSize: 11,
        bold: true,
        lineHeight: 1.3,
      },
      resposta: {
        fontSize: 10,
        lineHeight: 1.4,
        color: '#333333',
      },
    },
    footer: (currentPage: number, pageCount: number) => ({
      columns: [
        { text: 'Java Study — Simulado', style: { fontSize: 8, color: '#999999' } },
        {
          text: `${currentPage}/${pageCount}`,
          alignment: 'right',
          style: { fontSize: 8, color: '#999999' },
        },
      ],
      margin: [40, 10, 40, 0],
    }),
  };

  pdfMake.default.createPdf(docDefinition).download(
    `simulado-java-${totalPerguntas}q-${new Date().toISOString().slice(0, 10)}.pdf`,
  );
}
