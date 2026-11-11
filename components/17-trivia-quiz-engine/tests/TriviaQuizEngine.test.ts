import test from 'node:test';
import assert from 'node:assert/strict';
import { TriviaQuizEngine } from '../src/engine/TriviaQuizEngine.ts';

test('TriviaQuizEngine: validates answers, calculates score, and tracks completion', () => {
  const engine = new TriviaQuizEngine({
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        prompt: 'What is 2 + 2?',
        options: ['3', '4', '5'],
        correctOptionIndex: 1,
        points: 100,
      },
      {
        id: 'q2',
        type: 'true_false',
        prompt: 'React Native runs on iOS and Android.',
        options: ['True', 'False'],
        correctOptionIndex: 0,
        points: 100,
      },
    ],
  });

  assert.equal(engine.getState().currentIndex, 0);

  // Answer q1 correctly
  const res1 = engine.answer(1, 2); // answered in 2 seconds
  assert.equal(res1.isCorrect, true);
  assert.ok(res1.pointsAwarded >= 100);

  // Answer q2 incorrectly
  const res2 = engine.answer(1, 1);
  assert.equal(res2.isCorrect, false);
  assert.equal(res2.pointsAwarded, 0);

  // Check state
  const state = engine.getState();
  assert.equal(state.isComplete, true);
  assert.equal(state.correctAnswersCount, 1);

  engine.dispose();
});

