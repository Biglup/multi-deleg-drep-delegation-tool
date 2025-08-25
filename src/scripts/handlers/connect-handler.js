/**
 * Copyright 2025 Biglup Labs.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* IMPORTS ********************************************************************/

import * as ui from '../ui.js';
import { setState } from '../app-state.js';

/* DEFINITIONS ****************************************************************/

const WALLET_NAME = 'lace';

/**
 * Waits for the browser wallet extension to inject the `window.cardano` object.
 * @param {number} [timeout=3000] - The maximum time to wait in milliseconds.
 * @returns {Promise<object>} A promise that resolves with the specific wallet's API object.
 */
export const waitForCardanoWallet = (timeout = 3000) => {
    return new Promise((resolve, reject) => {
        const check = () => {
            if (window.cardano && window.cardano[WALLET_NAME]) {
                clearInterval(interval);
                resolve(window.cardano[WALLET_NAME]);
            }
        };
        const interval = setInterval(check, 100);
        setTimeout(() => {
            clearInterval(interval);
            reject(new Error(`Wallet extension '${WALLET_NAME}' not found after 3 seconds.`));
        }, timeout);
        check();
    });
};

/**
 * Reads and validates the user's input from the UI.
 * @returns {{network: Cometa.NetworkMagic, projectId: string}} The selected network and project ID.
 * @throws {Error} If the project ID is missing.
 */
const getUserInputs = () => {
    const projectId = ui.blockfrostKeyInput.value.trim();
    if (!projectId) {
        throw new Error('Please enter a Blockfrost Project ID.');
    }

    const networkMap = {
        mainnet: Cometa.NetworkMagic.Mainnet,
        preprod: Cometa.NetworkMagic.Preprod,
        preview: Cometa.NetworkMagic.Preview,
    };
    const network = networkMap[ui.networkSelect.value];

    return { network, projectId };
};

/**
 * Updates the UI based on the successful connection and fetched stake keys.
 * @param {string[]} stakeKeys - The array of registered stake keys.
 */
const updateUIOnConnect = (stakeKeys) => {
    if (stakeKeys.length === 0) {
        ui.log('No registered stake keys found in this wallet.', 'error');
        ui.keysDisplay.textContent = 'No registered stake keys found.';
    } else {
        ui.log(`Found ${stakeKeys.length} registered stake key(s).`, 'success');
        ui.keysDisplay.innerHTML = stakeKeys.map(key => `<p><code>${key}</code></p>`).join('');
    }

    ui.delegateSection.classList.remove('hidden');
    ui.disconnectBtn.classList.remove('hidden');
    ui.delegateBtn.disabled = false;
    ui.connectBtn.disabled = true;
    ui.blockfrostKeyInput.disabled = true;
    ui.networkSelect.disabled = true;
};

/**
 * Handles the entire wallet connection and setup process.
 */
export const connectWallet = async () => {
    try {
        const { network, projectId } = getUserInputs();

        ui.log('Waiting for wallet extension...');
        const walletApi = await waitForCardanoWallet();

        ui.log(`Connecting to ${WALLET_NAME} and requesting CIP-95 access...`);
        const cip30Api = await walletApi.enable({ extensions: [{ cip: 95 }] });

        const provider = new Cometa.BlockfrostProvider({ network, projectId });
        const wallet = new Cometa.BrowserExtensionWallet(cip30Api, provider);

        const walletNetworkId = await wallet.getNetworkId();
        const isMainnet = walletNetworkId === 1;
        const selectedIsMainnet = network === Cometa.NetworkMagic.Mainnet;

        if (isMainnet !== selectedIsMainnet) {
            throw new Error('Wallet and dropdown network selection do not match.');
        }

        ui.log('Wallet connected. Fetching registered stake keys...');
        const registeredStakeKeys = await wallet.getRegisteredPubStakeKeys();

        setState({ wallet, provider, registeredStakeKeys });
        updateUIOnConnect(registeredStakeKeys);

    } catch (error) {
        ui.log(`Error: ${error.message}`, 'error');
    }
};
