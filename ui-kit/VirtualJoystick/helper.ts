import { JoystickPosition } from './types';

/**
 * Clamps joystick thumbstick offset within a circular boundary.
 */
export function clampJoystickOffset(pos: JoystickPosition, maxRadius: number): JoystickPosition {
  const dist = Math.sqrt(pos.x * pos.x + pos.y * pos.y);
  if (dist <= maxRadius) return pos;
  const factor = maxRadius / dist;
  return {
    x: pos.x * factor,
    y: pos.y * factor,
  };
}

