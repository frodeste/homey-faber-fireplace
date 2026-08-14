'use strict';

const Homey = require('homey');
const { SERVICE_UUID, normalizeUuid } = require('../../lib/faber-protocol');

module.exports = class FaberItcDriver extends Homey.Driver {
  async onInit() {
    this.advertisements = new Map();
    this.log('Faber ITC BLE driver initialized');
  }

  async discover() {
    const found = await this.homey.ble.discover();
    for (const advertisement of found) {
      const serviceUuids = (advertisement.serviceUuids || []).map(normalizeUuid);
      const looksLikeFaber = serviceUuids.includes(SERVICE_UUID)
        || /faber|itc|gfp/i.test(advertisement.localName || '');
      if (looksLikeFaber) this.advertisements.set(advertisement.address, advertisement);
    }
    return [...this.advertisements.values()];
  }

  async onPairListDevices() {
    const advertisements = await this.discover();
    return advertisements.map((advertisement) => ({
      name: advertisement.localName || `Faber ITC (${advertisement.address})`,
      data: { address: advertisement.address },
      store: { localName: advertisement.localName || '' }
    }));
  }

  async getAdvertisement(address) {
    const cached = this.advertisements.get(address);
    if (cached) return cached;
    const advertisement = await this.homey.ble.find(address);
    this.advertisements.set(address, advertisement);
    return advertisement;
  }
};
