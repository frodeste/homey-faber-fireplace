# Security policy

## Reporting a vulnerability

Please do not disclose vulnerabilities that could cause unsafe fireplace operation in a public issue. Use GitHub's private vulnerability reporting feature for this repository. Include affected versions, reproduction details, impact, and any proposed mitigation.

Do not include credentials, unredacted device identifiers, or personal data. You should receive an acknowledgement within seven days, but this community project provides no guaranteed response or remediation timeline.

## Safety scope

This app sends user-level commands to the original Faber controller. It must not replace, disable, or work around physical safety systems. Stop using the integration if reported state differs from the physical fireplace, commands repeat unexpectedly, or the controller reports a warning or fault.
