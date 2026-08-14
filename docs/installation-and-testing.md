# Install and safely test on Homey

This guide installs the development version on a Homey Pro and commissions one Faber ITC fireplace. The BLE transport and command framing have not yet been confirmed on physical hardware, so follow the test order exactly.

> [!CAUTION]
> A gas fireplace is combustion equipment. Remain physically present, keep the original remote available, follow the Faber manual, and stop immediately if the physical state and Homey state disagree. Never bypass a controller warning, fault, lockout, cooldown, flame detector, ventilation requirement, or other safety mechanism.

## Requirements

- A [Homey Pro](https://homey.app/en-us/homey-pro/) associated with your Athom account
- Homey and the development computer connected to the same local network
- Node.js 18 or newer; Node.js 22 is used by this project's CI
- A Faber fireplace with a compatible Honeywell ITC v2 controller
- A functioning original Faber remote
- Physical access to the fireplace during commissioning

The target hardware is currently the Faber MatriX family with a Honeywell ITC v2 controller. Do not assume that an electric fireplace, a Mertik controller, or a Faber Wi-Fi controller uses the same protocol.

Useful official references:

- [Homey Apps SDK getting started](https://apps.developer.homey.app/the-basics/getting-started)
- [Homey CLI commands](https://apps.developer.homey.app/the-basics/getting-started/homey-cli)
- [Homey BLE API guide](https://apps.developer.homey.app/wireless/bluetooth)
- [Homey BLE Developer Tool guide](https://apps.developer.homey.app/guides/tools/bluetooth)
- [Homey Developer Tools](https://tools.developer.homey.app/tools)
- [Faber MatriX ITC user manual (English, PDF)](https://www.faberfires.com/sites/g/files/emiian311/files/2023-03/40011722-2141%20User%20manual%20MatriX%20ITC%20%28Honeywell%29%20ENG.pdf)

## 1. Prepare the project

Clone the repository and install its locked dependencies:

```sh
git clone https://github.com/frodeste/homey-faber-fireplace.git
cd homey-faber-fireplace
npm ci
npm test
npm run validate
```

All protocol tests must pass, and Homey validation must report that the app is valid at publish level.

## 2. Log in and select the Homey

From the project directory, run:

```sh
npx homey login
```

Open the URL printed by the CLI, sign in with the Athom account that owns the Homey, and paste the displayed authorization code back into the terminal.

Confirm the account and select the correct Homey:

```sh
npx homey whoami
npx homey list
npx homey select
```

If the development computer is shared or not trusted, log out with `npx homey logout` after testing.

## 3. Run the development app

Start the app with live debug logs:

```sh
npx homey app run
```

Keep this process running. `homey app run` uploads the app, displays its logs, and removes the development app when you press Ctrl+C. This is preferable during initial commissioning because connection and protocol errors remain visible.

For longer testing after commissioning, install it persistently with:

```sh
npx homey app install
```

Unlike development mode, persistent installation does not stream app logs to the terminal.

## 4. Put the ITC controller in pairing mode

1. Close the official Faber app completely on every nearby phone or tablet. A controller may reject or disrupt an additional active BLE connection.
2. On the original remote, press and hold **OFF** until its blue LED begins pulsing in a heartbeat pattern, then release it.
3. Pairing mode remains active for approximately 60 seconds. Repeat this step if it expires.

Consult the Faber manual linked above if the LED behavior differs. Do not confuse app pairing mode with the separate remote-control pairing procedure.

## 5. Add the device in Homey

In the Homey mobile or web app:

1. Select **Devices** and choose **Add device**.
2. Find **Faber Fireplace**.
3. Select **Faber ITC Fireplace**.
4. Start discovery while the ITC blue LED is still pulsing.
5. Select the fireplace advertisement and finish pairing.

The app accepts advertisements that expose the expected BLE UART service or whose name contains `Faber`, `ITC`, or `GFP`.

If no device appears, use the [Homey BLE Developer Tool](https://tools.developer.homey.app/tools) to verify that Homey can see the fireplace. Record its local name and advertised service UUIDs, but redact its Bluetooth address before sharing screenshots or logs.

## 6. Commission in the safe order

Do not begin with ON.

### A. Observe connection and status

After pairing, leave the device untouched and inspect the `homey app run` output. Expected app messages include initialization and BLE connection activity. The device should become available only after a valid status response.

Confirm that Homey reports plausible values for:

- current room temperature
- target temperature
- flame height
- flame width
- on/off state

If the device becomes unavailable with `Faber ITC did not answer over Bluetooth`, stop control testing and follow the diagnostics section. This likely means that service discovery worked but the assumed application framing or response assembly is incorrect.

### B. Test OFF

With the fireplace already physically off, press OFF in Homey. Confirm that:

- no unexpected ignition occurs
- the controller returns a response
- Homey continues to report OFF
- the original remote still works

Then, if the fireplace is already running under normal manual control, test OFF once and verify that it follows the manufacturer's shutdown sequence.

### C. Test non-ignition settings

Only after status and OFF are reliable, test one small setting change at a time. Compare Homey, the official physical state, and the original remote after each operation. Do not continue if commands repeat, values are implausible, or the device becomes unavailable.

### D. Test ON only with explicit readiness

Test ON only when an adult familiar with the fireplace is physically present and all normal conditions for safe operation are satisfied. Keep the original remote ready to send OFF. Perform one command, observe the full ignition sequence, and verify returned state before any further command.

## Diagnostics

### Homey cannot discover the fireplace

- Confirm the ITC is in app pairing mode and its blue LED is pulsing.
- Fully close the official Faber app on nearby devices.
- Move Homey closer temporarily and retry within the 60-second window.
- Check discovery in the [Homey BLE Developer Tool](https://apps.developer.homey.app/guides/tools/bluetooth).
- Confirm that the fireplace really has a Honeywell ITC v2 controller.

### Homey discovers it but cannot connect

- Power-cycle neither the fireplace nor its controller unless the Faber manual permits it.
- Ensure another phone is not holding the BLE connection.
- Stop `homey app run`, restart it, re-enter pairing mode, and retry once.
- Capture the exact redacted error from the development terminal.

### It connects but status times out

In the BLE Developer Tool, inspect the connected device for:

- service `713d0000-503e-4c75-ba94-3148f18d941e`
- notify characteristic `713d0002-503e-4c75-ba94-3148f18d941e`
- write-without-response characteristic `713d0003-503e-4c75-ba94-3148f18d941e`

Do not experiment with arbitrary writes. Report the service/characteristic properties and redacted logs using the repository's [bug-report form](https://github.com/frodeste/homey-faber-fireplace/issues/new?template=bug_report.yml).

### Reporting confirmed hardware

Once the sequence works, submit a [hardware-support report](https://github.com/frodeste/homey-faber-fireplace/issues/new?template=hardware_support.yml) with the fireplace model and controller HW/SW versions. Do not include Bluetooth addresses, serial numbers, credentials, or personal data.

## Stop and recover

Press Ctrl+C in the development terminal to stop and uninstall the development app. If behavior is unsafe or inconsistent, stop using the integration and operate the fireplace only through manufacturer-supported controls. Security or safety vulnerabilities should be reported privately according to the [security policy](../SECURITY.md).
