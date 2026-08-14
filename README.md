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

1. Put the ITC into app pairing mode: hold **OFF** on the existing remote until its blue LED pulses. Pairing mode lasts about 60 seconds.
2. Keep the Faber phone app fully closed; the controller may not accept another active BLE connection.
3. Install dependencies with `npm install`.
4. Log in with `npx homey login`, then run `npx homey app run`.
5. Add **Faber ITC Fireplace** in Homey while the controller is still in pairing mode.

Start by testing status and **OFF**. Test ignition only while physically present and follow the fireplace manufacturer's safety instructions. If pairing succeeds but status times out, collect the Homey BLE Developer Tools service list and an Android Bluetooth HCI snoop capture; do not repeatedly send unverified ignition commands.

## Development

```sh
npm test
npm run build
```

Do not edit generated `app.json`; edit `.homeycompose/app.json` and driver compose files.

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md), especially the capture-redaction and physical safety guidance, before submitting protocol traces.

## License

MIT. See [LICENSE](LICENSE).
