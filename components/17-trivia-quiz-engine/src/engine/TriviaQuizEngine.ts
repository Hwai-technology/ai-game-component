import { ValidationError } from '../../../../core/error-system/src/index.js';
import { Disposable } from '../../../../core/shared-types/src/index.js';
import { TriviaAnswerResult, TriviaQuestion, TriviaQuizConfig, TriviaQuizState } from '../types/index.js';

export class TriviaQuizEngine implements Disposable {
  private readonly questions: TriviaQuestion[];
  private currentIndex = 0;
  private score = 0;
  private correctCount = 0;
  private isComplete = false;
  private _isDisposed = false;

  constructor(config: TriviaQuizConfig) {
    if (!config.questions || config.questions.length === 0) {
      throw new ValidationError('TriviaQuizEngine requires at least one question');
    }
    this.questions = config.questions.map((q) => ({ ...q }));
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public getState(): TriviaQuizState {
    return {
      currentIndex: this.currentIndex,
      totalQuestions: this.questions.length,
      currentQuestion: this.isComplete ? undefined : this.questions[this.currentIndex],
      score: this.score,
      correctAnswersCount: this.correctCount,
      isComplete: this.isComplete,
    };
  }

  public answer(optionIndex: number, elapsedSeconds = 0): TriviaAnswerResult {
    if (this._isDisposed || this.isComplete) {
      throw new ValidationError('Quiz is already complete or disposed');
    }

    const question = this.questions[this.currentIndex]!;
    const isCorrect = optionIndex === question.correctOptionIndex;
    let points = 0;

    if (isCorrect) {
      const basePoints = question.points ?? 100;
      const speedBonus = Math.max(0, Math.floor(30 - elapsedSeconds * 2));
      points = basePoints + speedBonus;
      this.score += points;
      this.correctCount++;
    }

    const result: TriviaAnswerResult = {
      isCorrect,
      correctOptionIndex: question.correctOptionIndex,
      pointsAwarded: points,
      question,
    };

    this.currentIndex++;
    if (this.currentIndex >= this.questions.length) {
      this.isComplete = true;
    }

    return result;
  }

  public reset(): void {
    this.currentIndex = 0;
    this.score = 0;
    this.correctCount = 0;
    this.isComplete = false;
  }

  public dispose(): void {
    this._isDisposed = true;
  }
}

