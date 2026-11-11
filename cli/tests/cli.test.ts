import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { handleList, handleSearch, handleInspect, handleDoctor, handleCompatibility } from '../bin/gamekit.js';

describe('GameKit CLI Suite', () => {
  it('executes handleList without throwing', () => {
    assert.doesNotThrow(() => handleList());
    assert.doesNotThrow(() => handleList('puzzle'));
  });

  it('executes handleSearch with queries', () => {
    assert.doesNotThrow(() => handleSearch('runner'));
    assert.doesNotThrow(() => handleSearch(''));
  });

  it('executes handleInspect for valid and invalid components', () => {
    assert.doesNotThrow(() => handleInspect('12-match-three-engine'));
    assert.doesNotThrow(() => handleInspect('non-existent'));
  });

  it('executes handleDoctor without errors', () => {
    assert.doesNotThrow(() => handleDoctor());
  });

  it('executes handleCompatibility without errors', () => {
    assert.doesNotThrow(() => handleCompatibility());
  });
});
