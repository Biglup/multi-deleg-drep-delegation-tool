# Lace Bulk DRep Delegation Tool

A simple, browser-based tool for delegating multiple Cardano stake keys to a single Delegated Representative (DRep) in a single transaction. This dApp is built with [Cometa.js](https://github.com/Biglup/cometa.js) and is designed for use with Lace.

You can use the tool at [https://multidelegate-dreps.cometa.dev/](https://multidelegate-dreps.cometa.dev/)
## Features

- Connects to Lace.
- Fetches all of your wallet's currently registered stake keys (CIP-95).
- Delegates all fetched stake keys to a DRep of your choice in one transaction.
- Supports Mainnet, Preprod, and Preview testnets.

## How to Use

- Serve the File: Because browser wallets do not interact with file:// URLs for security, you must serve the index.html file from a local web server.
- Configure & Connect: Select your network, enter a corresponding Blockfrost Project ID, and click "Connect Wallet." Approve the connection in your wallet.
- Delegate: Once your registered stake keys appear, enter the DRep ID you wish to delegate to and click "Delegate All Keys."
- Sign: Approve the transaction in your wallet when prompted.

## Disclaimer ⚠️

This tool is provided as-is for demonstration and utility purposes. It has not been professionally audited. Always verify transaction details in your wallet before signing. Use with mainnet funds at your own risk
