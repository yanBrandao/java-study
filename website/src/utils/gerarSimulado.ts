import type { Question } from '../types/questions';

function limparMarkdown(texto: string): string {
  return texto
    // Remover blocos de código (manter conteúdo)
    .replace(/```[\w]*\n([\s\S]*?)```/g, (_match, code) => code.trim())
    // Remover backticks inline
    .replace(/`([^`]+)`/g, '$1')
    // Converter bold
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    // Converter itálico
    .replace(/\*([^*]+)\*/g, '$1')
    // Remover tags de avaliação
    .replace(/\*\*\[(Correto|Parcial|Incorreto|Não respondida)\]\*\*/g, '[$1]')
    // Limpar linhas de tabela markdown
    .replace(/\|[-:]+\|[-:|\s]+\|/g, '')
    // Remover pipes de tabela mas manter conteúdo
    .replace(/^\|(.+)\|$/gm, (_match, content) =>
      content.split('|').map((c: string) => c.trim()).filter(Boolean).join('  |  ')
    )
    // Remover headers R:
    .replace(/^R:\s*/gm, '')
    // Remover linhas vazias extras
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export async function gerarSimuladoPDF(
  perguntasSelecionadas: Question[],
): Promise<void> {
  // Import dinâmico para não carregar o pdfmake no bundle inicial
  const pdfMake = await import('pdfmake/build/pdfmake');
  const pdfFonts = await import('pdfmake/build/vfs_fonts');

  pdfMake.default.vfs = pdfFonts.default.pdfMake?.vfs ?? pdfFonts.default.vfs;

  const dataAtual = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const totalPerguntas = perguntasSelecionadas.length;

  // Contar perguntas por categoria
  const contagemCategorias = new Map<string, number>();
  for (const p of perguntasSelecionadas) {
    contagemCategorias.set(p.category, (contagemCategorias.get(p.category) || 0) + 1);
  }

  const resumoCategorias = Array.from(contagemCategorias.entries())
    .map(([cat, qtd]) => `${cat}: ${qtd}`)
    .join('  •  ');

  // --- Seção de perguntas ---
  const secaoPerguntas: any[] = [
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
  const secaoRespostas: any[] = [
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
    const resposta = p.hasAnswer
      ? limparMarkdown(p.answer)
      : 'Resposta ainda não disponível neste material.';

    secaoRespostas.push({
      stack: [
        {
          columns: [
            { text: `${i + 1}.`, width: 25, style: 'numeroPergunta' },
            { text: p.question, style: 'perguntaGabarito' },
          ],
        },
        {
          text: resposta,
          style: 'resposta',
          margin: [25, 5, 0, 0],
        },
      ],
      margin: [0, 0, 0, 15],
    });
  }

  const docDefinition: any = {
    pageSize: 'A4',
    pageMargins: [40, 40, 40, 40],
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
