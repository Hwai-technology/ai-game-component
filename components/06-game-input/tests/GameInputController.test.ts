import test from 'node:test';
import assert from 'node:assert/strict';
import { GameInputController } from '../src/engine/GameInputController.ts';

test('GameInputController: detects swipe directions and triggers mapped actions', () => {
  const controller = new GameInputController({
    swipeThresholdPx: 30,
    actionMap: {
      swipe_right: 'DODGE_RIGHT',
      swipe_left: 'DODGE_LEFT',
      swipe_up: 'JUMP',
      swipe_down: 'SLIDE',
      tap: 'FIRE',
      press: 'PRESS',
      release: 'RELEASE',
      drag: 'DRAG',
      long_press: 'CHARGE',
    },
  });

  const actions: string[] = [];
  controller.onAction('JUMP', () => actions.push('JUMP'));
  controller.onAction('DODGE_RIGHT', () => actions.push('DODGE_RIGHT'));
  controller.onAction('FIRE', () => actions.push('FIRE'));

  // 1. Simulate a Tap (dx = 2, dy = 1)
  controller.onPointerDown(1, { x: 100, y: 100 }, 1000);
  controller.onPointerUp(1, { x: 102, y: 101 }, 1050);
  assert.equal(actions.includes('FIRE'), true);

  // 2. Simulate Swipe Up (dy = -60)
  controller.onPointerDown(2, { x: 200, y: 300 }, 2000);
  controller.onPointerUp(2, { x: 205, y: 240 }, 2100);
  assert.equal(actions.includes('JUMP'), true);

  // 3. Simulate Swipe Right (dx = +70)
  controller.onPointerDown(3, { x: 50, y: 50 }, 3000);
  controller.onPointerUp(3, { x: 130, y: 52 }, 3120);
  assert.equal(actions.includes('DODGE_RIGHT'), true);

  controller.dispose();
});
