'use strict';

const Homey = require('homey');

module.exports = class FaberApp extends Homey.App {
  async onInit() {
    this.log('Faber ITC app initialized');
  }
};
