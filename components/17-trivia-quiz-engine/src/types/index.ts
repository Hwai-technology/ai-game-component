export type QuestionType = 'multiple_choice' | 'true_false';

export interface TriviaQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  points?: number;
}

export interface TriviaAnswerResult {
  isCorrect: boolean;
  correctOptionIndex: number;
  pointsAwarded: number;
  question: TriviaQuestion;
}

export interface TriviaQuizConfig {
  questions: TriviaQuestion[];
  timeLimitPerQuestionSeconds?: number;
}

export interface TriviaQuizState {
  currentIndex: number;
  totalQuestions: number;
  currentQuestion?: TriviaQuestion;
  score: number;
  correctAnswersCount: number;
  isComplete: boolean;
}
