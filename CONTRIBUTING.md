# Contributing

Thank you for helping improve the Faber Fireplace app for Homey.

## Before opening an issue

- Search existing issues first.
- Include the fireplace model, controller hardware/software versions, Homey model, Homey OS version, and app version.
- Remove Bluetooth addresses, Wi-Fi credentials, account details, location data, and other personal information from logs and captures.
- Do not post proprietary app binaries or copyrighted manuals. Link to the publisher's download page instead.

## Development workflow

1. Fork the repository and create a focused branch.
2. Install dependencies with `npm ci`.
3. Make the smallest change that solves the problem.
4. Add or update tests for protocol and state-parsing changes.
5. Run `npm test` and `npm run validate`.
6. Open a pull request using the provided template.

Keep protocol constants and parsing in `lib/`; keep Homey lifecycle and capability behavior in `drivers/`. Avoid optimistic state changes: fireplace state should reflect a validated controller response.

## Hardware and protocol testing

- Test status reads and OFF before testing ignition.
- Remain physically present during all experimental ignition tests.
- Never bypass or weaken controller interlocks, cooldown periods, flame detection, ventilation requirements, or other manufacturer safety features.
- Describe how a protocol observation was captured and confirmed. Where possible, provide a redacted trace and a test fixture rather than only a conclusion.

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
