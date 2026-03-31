export interface Question {
  id: string;
  category: string;
  categorySlug: string;
  sourceFile: string;
  sourceTitle: string;
  number: number;
  question: string;
  answer: string;
  hasAnswer: boolean;
}

export interface QuestionsData {
  categories: string[];
  totalQuestions: number;
  questions: Question[];
  categoryIcons: Record<string, string>;
}
