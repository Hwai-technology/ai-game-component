import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createDefaultRegistry } from '../src/index.js';

describe('ComponentRegistry & 50 Components Specification', () => {
  it('registers all 50 components', () => {
    const registry = createDefaultRegistry();
    const all = registry.list();
    assert.equal(all.length, 50, 'Must have exactly 50 components registered');
  });

  it('validates every component conforms to Expo SDK 58 and non-empty metadata', () => {
    const registry = createDefaultRegistry();
    for (const comp of registry.list()) {
      assert.ok(comp.id, 'Component must have an ID');
      assert.ok(comp.name, 'Component must have a Name');
      assert.equal(comp.expoSdk, '58.0.23', `${comp.id} must target Expo SDK 58.0.23`);
      assert.equal(comp.reactNativeVersion, '0.88.1', `${comp.id} must target React Native 0.88.1`);
      assert.ok(comp.platforms.includes('ios'), `${comp.id} must support iOS`);
      assert.ok(comp.platforms.includes('android'), `${comp.id} must support Android`);
      assert.ok(comp.entryPoint.length > 0, `${comp.id} must specify entry point`);
    }
  });

  it('supports searching by keywords, tags, or category', () => {
    const registry = createDefaultRegistry();
    const puzzleComponents = registry.filterByCategory('puzzle');
    assert.equal(puzzleComponents.length, 10);

    const searchResults = registry.search('match-three');
    assert.ok(searchResults.length >= 1);
    assert.equal(searchResults[0]?.id, '12-match-three-engine');
  });
});
