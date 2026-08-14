'use strict';

const {
  SERVICE_UUID, NOTIFY_UUID, WRITE_UUID, commandRequest, statusRequest, parseStatus
} = require('./faber-protocol');

const RESPONSE_TIMEOUT = 8000;

module.exports = class FaberBleClient {
  constructor({ advertisement, log = () => {} }) {
    this.advertisement = advertisement;
    this.log = log;
    this.queue = Promise.resolve();
    this.received = Buffer.alloc(0);
    this.waiter = null;
  }

  async connect() {
    if (this.peripheral) return this.peripheral;
    const peripheral = await this.advertisement.connect();
    await peripheral.assertConnected();
    await peripheral.discoverAllServicesAndCharacteristics();
    peripheral.on('disconnect', () => { this.peripheral = null; });
    const service = await peripheral.getService(SERVICE_UUID);
    this.notifyCharacteristic = await service.getCharacteristic(NOTIFY_UUID);
    await this.notifyCharacteristic.subscribeToNotifications((data) => this.onData(data));
    this.peripheral = peripheral;
    return peripheral;
  }

  onData(data) {
    this.received = Buffer.concat([this.received, data]);
    if (this.waiter && this.received.length >= this.waiter.length) {
      const response = this.received.subarray(0, this.waiter.length);
      this.received = this.received.subarray(this.waiter.length);
      const { resolve, timer } = this.waiter;
      this.waiter = null;
      clearTimeout(timer);
      resolve(response);
    }
  }

  transact(payload, responseLength) {
    const operation = async () => {
      const peripheral = await this.connect();
      this.received = Buffer.alloc(0);
      const response = new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          this.waiter = null;
          reject(new Error('Faber ITC did not answer over Bluetooth'));
        }, RESPONSE_TIMEOUT);
        this.waiter = { resolve, reject, timer, length: responseLength };
      });
      for (let offset = 0; offset < payload.length; offset += 20) {
        await peripheral.write(SERVICE_UUID, WRITE_UUID, payload.subarray(offset, offset + 20));
      }
      return response;
    };
    const result = this.queue.then(operation, operation);
    this.queue = result.catch(() => {});
    return result;
  }

  async sendCommand(command, value = 0) {
    return this.transact(commandRequest(command, value), 29);
  }

  async getStatus() {
    return parseStatus(await this.transact(statusRequest(), 61));
  }

  async disconnect() {
    if (this.notifyCharacteristic) await this.notifyCharacteristic.unsubscribeFromNotifications().catch(() => {});
    if (this.peripheral) await this.peripheral.disconnect().catch(() => {});
    this.peripheral = null;
  }
};
