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

/* DEFINITIONS ****************************************************************/

/**
 * A central, in-memory store for the application's shared state.
 * @property {object | null} wallet - The connected Cometa wallet instance.
 * @property {object | null} provider - The configured provider instance (e.g., Blockfrost).
 * @property {string[]} registeredStakeKeys - An array of registered stake keys fetched from the wallet.
 */
export const state = {
    wallet: null,
    provider: null,
    registeredStakeKeys: [],
};

/**
 * Merges a new state object into the central state.
 * @param {object} newState - An object containing the new state properties to update.
 */
export const setState = (newState) => {
    Object.assign(state, newState);
};

/**
 * Resets the central state to its initial, default values.
 */
export const resetState = () => {
    state.wallet = null;
    state.provider = null;
    state.registeredStakeKeys = [];
};