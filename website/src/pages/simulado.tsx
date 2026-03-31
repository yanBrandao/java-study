import React, { useState, useMemo } from 'react';
import Layout from '@theme/Layout';
import { usePluginData } from '@docusaurus/useGlobalData';
import type { QuestionsData } from '../types/questions';
import { selecionarPerguntas } from '../utils/selecionarPerguntas';
import { gerarSimuladoPDF } from '../utils/gerarSimulado';
import styles from './simulado.module.css';

export default function SimuladoPage(): React.JSX.Element {
  const rawData = usePluginData('questions-plugin') as QuestionsData;
  const data = useMemo(() => ({
    ...rawData,
    questions: rawData.questions.filter((q) => q.hasAnswer),
    totalQuestions: rawData.questions.filter((q) => q.hasAnswer).length,
  }), [rawData]);
  const [quantidade, setQuantidade] = useState(20);
  const [gerando, setGerando] = useState(false);
  const [categoriasAtivas, setCategoriasAtivas] = useState<Set<string>>(() => {
    const slugs = new Set<string>();
    data.questions.forEach((q) => slugs.add(q.categorySlug));
    return slugs;
  });

  const categorias = useMemo(() => {
    const mapa = new Map<string, { slug: string; label: string; count: number }>();
    for (const q of data.questions) {
      const entry = mapa.get(q.categorySlug) || {
        slug: q.categorySlug,
        label: q.category,
        count: 0,
      };
      entry.count++;
      mapa.set(q.categorySlug, entry);
    }
    return Array.from(mapa.values());
  }, [data]);

  const perguntasDisponiveis = useMemo(
    () => data.questions.filter((q) => categoriasAtivas.has(q.categorySlug)).length,
    [data, categoriasAtivas],
  );

  const toggleCategoria = (slug: string) => {
    setCategoriasAtivas((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        if (next.size > 1) next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  const handleGerar = async () => {
    setGerando(true);
    try {
      const selecionadas = selecionarPerguntas(
        data.questions,
        quantidade,
        Array.from(categoriasAtivas),
      );
      await gerarSimuladoPDF(selecionadas, data.categoryIcons);
    } finally {
      setGerando(false);
    }
  };

  return (
    <Layout title="Simulado" description="Gere um simulado de entrevista Java em PDF">
      <main className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.titulo}>Simulado — Prova Prática</h1>
          <p className={styles.descricao}>
            Gere um simulado com questões aleatórias de diferentes categorias.
            O PDF contém as perguntas nas primeiras páginas e o gabarito nas seguintes.
          </p>

          <div className={styles.campo}>
            <label htmlFor="quantidade" className={styles.label}>
              Quantidade de questões
            </label>
            <div className={styles.inputGroup}>
              <input
                id="quantidade"
                type="range"
                min={Math.min(6, perguntasDisponiveis)}
                max={perguntasDisponiveis}
                value={Math.min(quantidade, perguntasDisponiveis)}
                onChange={(e) => setQuantidade(Number(e.target.value))}
                className={styles.slider}
              />
              <input
                type="number"
                min={1}
                max={perguntasDisponiveis}
                value={Math.min(quantidade, perguntasDisponiveis)}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val >= 1 && val <= perguntasDisponiveis) setQuantidade(val);
                }}
                className={styles.inputNumero}
              />
            </div>
            <span className={styles.disponivel}>
              {perguntasDisponiveis} questões disponíveis
            </span>
          </div>

          <div className={styles.campo}>
            <label className={styles.label}>Categorias</label>
            <div className={styles.categorias}>
              {categorias.map((cat) => (
                <button
                  key={cat.slug}
                  className={`${styles.categoriaChip} ${
                    categoriasAtivas.has(cat.slug) ? styles.categoriaAtiva : ''
                  }`}
                  onClick={() => toggleCategoria(cat.slug)}
                  type="button"
                >
                  {cat.label}
                  <span className={styles.categoriaCount}>{cat.count}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            className={styles.botaoGerar}
            onClick={handleGerar}
            disabled={gerando || perguntasDisponiveis === 0}
            type="button"
          >
            {gerando ? 'Gerando PDF...' : 'Gerar Simulado (PDF)'}
          </button>
        </div>
      </main>
    </Layout>
  );
}
