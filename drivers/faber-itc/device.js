'use strict';

const Homey = require('homey');
const FaberBleClient = require('../../lib/faber-ble-client');
const { COMMANDS } = require('../../lib/faber-protocol');

module.exports = class FaberItcDevice extends Homey.Device {
  async onInit() {
    this.registerCapabilityListener('onoff', (value) => this.command(value ? COMMANDS.ON : COMMANDS.OFF));
    this.registerCapabilityListener('target_temperature', (value) => this.command(COMMANDS.TEMPERATURE, Math.round(value * 2)));
    this.registerCapabilityListener('flame_height', (value) => this.command(COMMANDS.HEIGHT, value));
    this.registerCapabilityListener('flame_width', (value) => this.command(value === 'wide' ? COMMANDS.WIDTH_WIDE : COMMANDS.WIDTH_NARROW));
    await this.startPolling();
  }

  async getClient() {
    if (!this.client) {
      const advertisement = await this.driver.getAdvertisement(this.getData().address);
      this.client = new FaberBleClient({ advertisement, log: this.log.bind(this) });
    }
    return this.client;
  }

  async command(command, value = 0) {
    try {
      await (await this.getClient()).sendCommand(command, value);
      await this.refreshStatus();
    } catch (error) {
      await this.setUnavailable(error.message);
      if (this.client) await this.client.disconnect();
      this.client = null;
      throw error;
    }
  }

  async refreshStatus() {
    const status = await (await this.getClient()).getStatus();
    await Promise.all([
      this.setCapabilityValue('onoff', status.mode !== 0),
      this.setCapabilityValue('target_temperature', status.targetTemperature),
      this.setCapabilityValue('measure_temperature', status.temperature),
      this.setCapabilityValue('flame_height', status.flameHeight),
      this.setCapabilityValue('flame_width', status.flameWidth ? 'wide' : 'narrow')
    ]);
    await this.setAvailable();
  }

  async startPolling() {
    if (this.pollTimer) this.homey.clearInterval(this.pollTimer);
    const seconds = Math.max(15, Number(this.getSetting('poll_interval')) || 30);
    const poll = () => this.refreshStatus().catch(async (error) => {
      this.error(error);
      await this.setUnavailable(error.message).catch(this.error);
    });
    await poll();
    this.pollTimer = this.homey.setInterval(poll, seconds * 1000);
  }

  async onSettings({ changedKeys }) {
    if (changedKeys.includes('poll_interval')) await this.startPolling();
  }

  async onDeleted() {
    if (this.pollTimer) this.homey.clearInterval(this.pollTimer);
    if (this.client) await this.client.disconnect();
  }
};
