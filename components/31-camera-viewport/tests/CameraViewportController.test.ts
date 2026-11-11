import test from 'node:test';
import assert from 'node:assert/strict';
import { CameraViewportController } from '../src/engine/CameraViewportController.ts';

test('CameraViewportController: centers target and clamps within world boundaries', () => {
  const camera = new CameraViewportController({
    viewport: { width: 400, height: 300 },
    worldBounds: { x: 0, y: 0, width: 1000, height: 1000 },
    lerpSpeed: 1.0, // instant
  });

  // Follow target at (500, 500) -> camera center at (500, 500), position at (300, 350)
  camera.followTarget({ x: 500, y: 500 }, true);
  assert.equal(camera.getState().position.x, 300);
  assert.equal(camera.getState().position.y, 350);

  // Coordinate transforms
  const screenPt = camera.worldToScreen({ x: 500, y: 500 });
  assert.equal(screenPt.x, 200); // exactly center of 400px width
  assert.equal(screenPt.y, 150); // exactly center of 300px height

  // Try following target outside left edge -> clamps to minX = 0
  camera.followTarget({ x: 50, y: 50 }, true);
  assert.equal(camera.getState().position.x, 0);
  assert.equal(camera.getState().position.y, 0);

  camera.dispose();
});
