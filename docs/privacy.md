# Privacy

Complete Gardener Planner v1 does not use analytics.

## What Stays Local

- Garden plan settings are stored in the browser through IndexedDB.
- Uploaded photos are analyzed in the browser.
- Uploaded photo bytes are not stored by default.

## Network Requests

The app fetches static data from:

https://baditaflorin.github.io/complete-gardener-planner/data/v1/

The footer may fetch the latest public commit from:

https://api.github.com/repos/baditaflorin/complete-gardener-planner/commits/main

The GitHub and PayPal links open only when clicked.

## No Secrets

The frontend must never contain API keys, tokens, passwords, private keys, or obfuscated secrets.
