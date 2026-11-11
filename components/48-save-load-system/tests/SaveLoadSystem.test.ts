import test from 'node:test';
import assert from 'node:assert/strict';
import { MemoryStorageAdapter, SaveLoadSystem } from '../src/engine/SaveLoadSystem.ts';

test('SaveLoadSystem: serializes with checksum and migrates schema versions', async () => {
  const memory = new MemoryStorageAdapter();

  // Version 1 system saves { coins: 50 }
  const v1System = new SaveLoadSystem<{ coins: number }>({
    key: 'game_save',
    currentVersion: 1,
    storage: memory,
  });

  await v1System.save({ coins: 50 });

  // Version 2 system introduces gems field with migration
  interface SaveV2 {
    coins: number;
    gems: number;
  }

  const v2System = new SaveLoadSystem<SaveV2>({
    key: 'game_save',
    currentVersion: 2,
    storage: memory,
    migrations: {
      1: (oldData: any) => ({
        ...oldData,
        gems: 10, // grant 10 gems during migration from v1 to v2
      }),
    },
  });

  const loaded = await v2System.load({ coins: 0, gems: 0 });
  assert.equal(loaded.coins, 50);
  assert.equal(loaded.gems, 10, 'Migration applied successfully');

  v1System.dispose();
  v2System.dispose();
});

