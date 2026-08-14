# Faber Fireplace for Homey

Experimental local Bluetooth integration for Faber fireplaces with an ITC v2 controller.

[![CI](https://github.com/frodeste/homey-faber-fireplace/actions/workflows/ci.yml/badge.svg)](https://github.com/frodeste/homey-faber-fireplace/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> [!WARNING]
> This is an independent, unofficial project for controlling gas-burning equipment. It is not affiliated with or endorsed by Faber or Glen Dimplex. Never bypass the fireplace's built-in safety controls, and perform initial testing while physically present.

## What is implemented

- Homey Apps SDK v3 app and BLE driver
- discovery of the Faber/ITC BLE UART service
- pairing, reconnect and serialized BLE communication
- on/off, target temperature, flame height and flame width
- status polling for fireplace state and room temperature
- protocol tests

The BLE service and characteristics come from the official Faber ITC V2 Android app. The 29-byte command framing and 61-byte status response are based on the independently published `faber-fireplace` Python package. The assumption that the same application frames are transported over BLE must still be confirmed against a real fireplace.

## Supported hardware

The current target is the Faber MatriX family with a Honeywell ITC v2 controller. Other Faber, Glen Dimplex, Mertik, Wi-Fi, and electric-fireplace controllers may use different protocols. Please report confirmed models using the hardware-support issue template.

## Test on a Homey Pro

Follow the [installation and safe commissioning guide](docs/installation-and-testing.md). It covers Homey CLI login, development installation, ITC pairing, the test sequence, expected logs, and troubleshooting.

## Development

```sh
npm test
npm run build
```

Do not edit generated `app.json`; edit `.homeycompose/app.json` and driver compose files.

## Documentation

- [Install and safely test on Homey](docs/installation-and-testing.md)
- [Contributing](CONTRIBUTING.md)
- [Security policy](SECURITY.md)
- [Homey Apps SDK documentation](https://apps.developer.homey.app/)
- [Homey Bluetooth LE documentation](https://apps.developer.homey.app/wireless/bluetooth)
- [Faber MatriX ITC user manual (English, PDF)](https://www.faberfires.com/sites/g/files/emiian311/files/2023-03/40011722-2141%20User%20manual%20MatriX%20ITC%20%28Honeywell%29%20ENG.pdf)

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md), especially the capture-redaction and physical safety guidance, before submitting protocol traces.

## License

MIT. See [LICENSE](LICENSE).
