import test from 'node:test';
import assert from 'node:assert/strict';
import { DialogueTreeEngine } from '../src/engine/DialogueTreeEngine.ts';

test('DialogueTreeEngine: walks branches based on user choice selection', () => {
  const dialogue = new DialogueTreeEngine({
    startNodeId: 'greet',
    nodes: {
      greet: {
        id: 'greet',
        speakerName: 'Old Man',
        text: 'It is dangerous to go alone! Take this.',
        choices: [
          { text: 'Accept sword', targetNodeId: 'accept' },
          { text: 'Decline', targetNodeId: 'decline' },
        ],
      },
      accept: {
        id: 'accept',
        speakerName: 'Old Man',
        text: 'May fortune guide your blade!',
      },
      decline: {
        id: 'decline',
        speakerName: 'Old Man',
        text: 'Then be careful, young traveler.',
      },
    },
  });

  assert.equal(dialogue.getCurrentNode()?.id, 'greet');
  assert.equal(dialogue.getAvailableChoices().length, 2);

  // Select choice 0 ('Accept sword')
  const nextNode = dialogue.selectChoice(0);
  assert.equal(nextNode?.id, 'accept');
  assert.equal(dialogue.getCurrentNode()?.text, 'May fortune guide your blade!');

  // Advance past end
  dialogue.advance();
  assert.equal(dialogue.getState().isEnded, true);

  dialogue.dispose();
});

