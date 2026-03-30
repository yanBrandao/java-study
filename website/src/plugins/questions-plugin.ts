import type { LoadContext, Plugin } from '@docusaurus/types';
import * as fs from 'fs';
import * as path from 'path';
import type { Question, QuestionsData } from '../types/questions';

const ENTREVISTA_DIR = path.resolve(__dirname, '../../../entrevista-java');

const CATEGORY_DIRS = [
  'java-core',
  'spring-boot',
  'jpa-hibernate',
  'sql-bancos-dados',
  'ferramentas',
  'praticas-profissionais',
];

function getCategoryLabel(categoryDir: string): string {
  const categoryJsonPath = path.join(ENTREVISTA_DIR, categoryDir, '_category_.json');
  try {
    const data = JSON.parse(fs.readFileSync(categoryJsonPath, 'utf-8'));
    return data.label || categoryDir;
  } catch {
    return categoryDir;
  }
}

function parseMarkdownFile(
  filePath: string,
  categorySlug: string,
  categoryLabel: string,
): Question[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath, '.md');
  const questions: Question[] = [];

  // Extrair título do frontmatter
  const titleMatch = content.match(/^title:\s*"?([^"\n]+)"?\s*$/m);
  const sourceTitle = titleMatch ? titleMatch[1] : fileName;

  // Dividir por headers de perguntas (### N.)
  const parts = content.split(/^### /m);

  // O primeiro elemento é o frontmatter + título h1, ignorar
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const lines = part.split('\n');

    // Primeira linha é "N. Texto da pergunta?"
    const questionLine = lines[0].trim();
    const numberMatch = questionLine.match(/^(\d+)\.\s+(.+)/);
    if (!numberMatch) continue;

    const number = parseInt(numberMatch[1], 10);
    const questionText = numberMatch[2];

    // O resto é a resposta (tudo após a primeira linha)
    const answerLines = lines.slice(1);
    const answer = answerLines.join('\n').trim();
    const hasAnswer = answer.length > 0;

    questions.push({
      id: `${categorySlug}/${fileName}/${number}`,
      category: categoryLabel,
      categorySlug,
      sourceFile: fileName,
      sourceTitle,
      number,
      question: questionText,
      answer,
      hasAnswer,
    });
  }

  return questions;
}

export default function questionsPlugin(_context: LoadContext): Plugin<QuestionsData> {
  return {
    name: 'questions-plugin',

    async loadContent(): Promise<QuestionsData> {
      const allQuestions: Question[] = [];
      const categories: string[] = [];

      for (const categoryDir of CATEGORY_DIRS) {
        const categoryLabel = getCategoryLabel(categoryDir);
        categories.push(categoryLabel);

        const dirPath = path.join(ENTREVISTA_DIR, categoryDir);
        if (!fs.existsSync(dirPath)) continue;

        const files = fs.readdirSync(dirPath)
          .filter((f) => f.endsWith('.md'))
          .sort();

        for (const file of files) {
          const filePath = path.join(dirPath, file);
          const questions = parseMarkdownFile(filePath, categoryDir, categoryLabel);
          allQuestions.push(...questions);
        }
      }

      return {
        categories,
        totalQuestions: allQuestions.length,
        questions: allQuestions,
      };
    },

    async contentLoaded({ content, actions }): Promise<void> {
      const { setGlobalData } = actions;
      setGlobalData(content);
    },
  };
}
