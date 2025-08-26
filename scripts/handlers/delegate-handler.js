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
import { state } from '../app-state.js';

/* DEFINITIONS ****************************************************************/

/**
 * Validates the necessary inputs for the delegation transaction.
 * @returns {string} The validated DRep ID.
 * @throws {Error} If the DRep ID is missing or there are no keys to delegate.
 */
const validateInputs = () => {
    const drepId = ui.drepIdInput.value.trim();
    if (!drepId) {
        throw new Error('Please enter a DRep ID.');
    }
    if (state.registeredStakeKeys.length === 0) {
        throw new Error('There are no registered stake keys to delegate.');
    }
    return drepId;
};

/**
 * Builds the delegation transaction.
 * @param {string} drepId - The DRep ID to delegate to.
 * @returns {Promise<string>} A promise that resolves to the unsigned transaction CBOR string.
 */
const buildDelegationTransaction = async (drepId) => {
    ui.log(`Preparing to delegate ${state.registeredStakeKeys.length} key(s) to DRep: ${drepId}`);

    const builder = await state.wallet.createTransactionBuilder();
    const networkId = await state.wallet.getNetworkId();

    for (const stakeKeyHex of state.registeredStakeKeys) {
        const pubKeyHash = Cometa.Ed25519PublicKey.fromHex(stakeKeyHex).toHashHex();
        const stakeCredential = { hash: pubKeyHash, type: Cometa.CredentialType.KeyHash };
        const rewardAddress = Cometa.RewardAddress.fromCredentials(networkId, stakeCredential);

        ui.log(`Adding delegation for: ${rewardAddress.toBech32()}`);
        builder.delegateVotingPower({ rewardAddress, drepId });
    }

    ui.log('Building transaction...');
    return builder.build();
};

/**
 * Signs and submits the transaction.
 * @param {string} unsignedTx - The unsigned transaction CBOR string.
 * @returns {Promise<string>} A promise that resolves to the transaction ID.
 */
const signAndSubmitTransaction = async (unsignedTx) => {
    ui.log('Please sign the transaction in your wallet...');
    const witnessSet = await state.wallet.signTransaction(unsignedTx, false);
    const signedTx = Cometa.applyVkeyWitnessSet(unsignedTx, witnessSet);

    ui.log('Submitting transaction...');
    const txId = await state.wallet.submitTransaction(signedTx);
    ui.log(`Transaction submitted successfully! TxID: ${txId}`, 'success');
    return txId;
};

/**
 * Handles the entire delegation process.
 */
export const delegate = async () => {
    try {
        ui.delegateBtn.disabled = true;
        const drepId = validateInputs();
        const unsignedTx = await buildDelegationTransaction(drepId);
        await signAndSubmitTransaction(unsignedTx);
    } catch (error) {
        console.error(error)
        ui.log(`Transaction failed: ${error}`, 'error');
    } finally {
        ui.delegateBtn.disabled = false;
    }
};