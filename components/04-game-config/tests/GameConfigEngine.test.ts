import test from 'node:test';
import assert from 'node:assert/strict';
import { GameConfigEngine } from '../src/engine/GameConfigEngine.ts';

test('GameConfigEngine: merges overrides and validates schema', () => {
  interface GameConfig {
    audio: {
      musicVolume: number;
      sfxVolume: number;
    };
    difficulty: 'easy' | 'normal' | 'hard';
  }

  const engine = new GameConfigEngine<GameConfig>(
    {
      defaults: {
        audio: { musicVolume: 0.8, sfxVolume: 1.0 },
        difficulty: 'normal',
      },
      environmentOverrides: {
        dev: {
          audio: { musicVolume: 0.2 },
        },
      },
      validator: (cfg) => {
        if (cfg.audio.musicVolume < 0 || cfg.audio.musicVolume > 1) {
          return 'musicVolume must be between 0 and 1';
        }
        return null;
      },
    },
    'dev'
  );

  assert.equal(engine.get().audio.musicVolume, 0.2, 'Environment override should be applied');
  assert.equal(engine.get().audio.sfxVolume, 1.0, 'Default should be preserved');

  engine.update({ audio: { sfxVolume: 0.5 } });
  assert.equal(engine.get().audio.sfxVolume, 0.5);

  assert.throws(() => {
    engine.update({ audio: { musicVolume: 1.5 } });
  }, /validation failed|rejected/i);

  engine.dispose();
});
