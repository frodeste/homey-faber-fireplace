'use strict';

const SERVICE_UUID = '713d0000503e4c75ba943148f18d941e';
const NOTIFY_UUID = '713d0002503e4c75ba943148f18d941e';
const WRITE_UUID = '713d0003503e4c75ba943148f18d941e';

const HEADER = Buffer.from([0xa1, 0xa2, 0xa3, 0xa4, 0x00, 0xfa, 0x00, 0x02]);
const COMMAND_PREFIX = Buffer.from([0x00, 0x00, 0x7d, 0xed, 0x00, 0x00, 0x10, 0x40, 0xff, 0xff, 0x00]);
const STATUS_PREFIX = Buffer.from([0x00, 0x00, 0x7d, 0xed, 0x00, 0x00, 0x10, 0x30, 0x00, 0x00, 0x00]);
const SUFFIX = Buffer.from([0x00, 0xfa, 0xfb, 0xfc, 0xfd]);

function normalizeUuid(uuid = '') {
  return uuid.toLowerCase().replaceAll('-', '');
}

function request(prefix, command, value = 0) {
  return Buffer.concat([
    HEADER,
    prefix,
    Buffer.from([command, 0, 0, 0, value]),
    SUFFIX
  ]);
}

function commandRequest(command, value = 0) {
  return request(COMMAND_PREFIX, command, value);
}

function statusRequest() {
  return request(STATUS_PREFIX, 0);
}

function parseStatus(data) {
  if (!Buffer.isBuffer(data) || data.length < 61) throw new Error('Incomplete Faber status response');
  if (!data.subarray(0, 4).equals(HEADER.subarray(0, 4))) throw new Error('Unexpected Faber response header');
  return {
    mode: data[27],
    flameHeight: data[31],
    flameWidth: data[32],
    targetTemperature: data[33] / 2,
    temperature: data.readUInt16BE(36) / 10
  };
}

module.exports = {
  SERVICE_UUID,
  NOTIFY_UUID,
  WRITE_UUID,
  normalizeUuid,
  commandRequest,
  statusRequest,
  parseStatus,
  COMMANDS: Object.freeze({ OFF: 0x01, ON: 0x02, WIDTH_NARROW: 0x05, WIDTH_WIDE: 0x06, HEIGHT: 0x09, TEMPERATURE: 0x22 })
};
