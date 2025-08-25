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

// --- Exported UI Element References ---
export const connectBtn = document.getElementById('connect-btn');
export const disconnectBtn = document.getElementById('disconnect-btn');
export const networkSelect = document.getElementById('network-select');
export const delegateSection = document.getElementById('delegate-section');
export const keysDisplay = document.getElementById('keys-display');
export const blockfrostKeyInput = document.getElementById('blockfrost-key-input');
export const drepIdInput = document.getElementById('drep-id-input');
export const delegateBtn = document.getElementById('delegate-btn');

// --- Private UI Element References ---
const logOutput = document.getElementById('log-output');

/**
 * Appends a formatted message to the on-screen log panel.
 * @param {string} message - The message content to display.
 * @param {'info' | 'success' | 'error'} [type='info'] - The type of message, used for styling.
 */
export const log = (message, type = 'info') => {
    const line = document.createElement('div');
    line.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    if (type === 'success') line.className = 'success';
    if (type === 'error') line.className = 'error';
    logOutput.appendChild(line);
    logOutput.scrollTop = logOutput.scrollHeight; // Auto-scroll to the bottom
};

/**
 * Resets the user interface to its initial, disconnected state.
 */
export const resetUI = () => {
    delegateSection.classList.add('hidden');
    disconnectBtn.classList.add('hidden');
    keysDisplay.innerHTML = '';
    drepIdInput.value = '';
    connectBtn.disabled = false;
    blockfrostKeyInput.disabled = false;
    networkSelect.disabled = false;
    delegateBtn.disabled = true;
    log('Wallet disconnected. Please reconnect to continue.');
};
