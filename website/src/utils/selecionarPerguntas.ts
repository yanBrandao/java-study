import type { Question } from '../types/questions';

function embaralhar<T>(array: T[]): T[] {
  const copia = [...array];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export function selecionarPerguntas(
  todasPerguntas: Question[],
  total: number,
  categoriasAtivas?: string[],
): Question[] {
  // Filtrar por categorias ativas
  const perguntas = categoriasAtivas
    ? todasPerguntas.filter((q) => categoriasAtivas.includes(q.categorySlug))
    : [...todasPerguntas];

  if (total >= perguntas.length) {
    return embaralhar(perguntas);
  }

  // Agrupar por categoria
  const porCategoria = new Map<string, Question[]>();
  for (const p of perguntas) {
    const lista = porCategoria.get(p.categorySlug) || [];
    lista.push(p);
    porCategoria.set(p.categorySlug, lista);
  }

  const categorias = Array.from(porCategoria.keys());
  const selecionadas: Question[] = [];
  const idsUsados = new Set<string>();

  // Garantir mínimo de 2 por categoria (se possível)
  const minimoPorCategoria = Math.min(2, Math.floor(total / categorias.length));

  for (const cat of categorias) {
    const disponiveis = embaralhar(porCategoria.get(cat)!);
    const qtd = Math.min(minimoPorCategoria, disponiveis.length);
    for (let i = 0; i < qtd; i++) {
      selecionadas.push(disponiveis[i]);
      idsUsados.add(disponiveis[i].id);
    }
  }

  // Preencher vagas restantes aleatoriamente
  const restantes = embaralhar(
    perguntas.filter((q) => !idsUsados.has(q.id)),
  );

  const vagasRestantes = total - selecionadas.length;
  for (let i = 0; i < vagasRestantes && i < restantes.length; i++) {
    selecionadas.push(restantes[i]);
  }

  return embaralhar(selecionadas);
}
