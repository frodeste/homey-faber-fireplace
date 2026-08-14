'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { COMMANDS, commandRequest, statusRequest, parseStatus } = require('../lib/faber-protocol');

test('builds the published 29-byte ITC command frame', () => {
  const frame = commandRequest(COMMANDS.TEMPERATURE, 43);
  assert.equal(frame.length, 29);
  assert.equal(frame.toString('hex'), 'a1a2a3a400fa000200007ded00001040ffff00220000002b00fafbfcfd');
});

test('builds a status request', () => {
  assert.equal(statusRequest().toString('hex'), 'a1a2a3a400fa000200007ded00001030000000000000000000fafbfcfd');
});

test('parses ITC status fields', () => {
  const response = Buffer.alloc(61);
  response.set([0xa1, 0xa2, 0xa3, 0xa4]);
  response[27] = 2;
  response[31] = 8;
  response[32] = 1;
  response[33] = 43;
  response.writeUInt16BE(213, 36);
  assert.deepEqual(parseStatus(response), {
    mode: 2,
    flameHeight: 8,
    flameWidth: 1,
    targetTemperature: 21.5,
    temperature: 21.3
  });
});
