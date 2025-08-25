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

import { connectWallet } from './handlers/connect-handler.js';
import { delegate } from './handlers/delegate-handler.js';
import * as ui from './ui.js';
import { resetState } from './app-state.js';

/* DEFINITIONS ****************************************************************/

/**
 * The main entry point for the application.
 *
 * This function waits for the HTML document to be fully loaded, initializes the
 * Cometa.js library, and then attaches the core event handlers to the UI buttons.
 */
document.addEventListener('DOMContentLoaded', async () => {
    await Cometa.ready();
    ui.log('Cometa.js is ready. Please select a network, provide your key, and connect your wallet.');

    // Attach event listeners to their corresponding handlers
    ui.connectBtn.addEventListener('click', connectWallet);
    ui.delegateBtn.addEventListener('click', delegate);
    ui.disconnectBtn.addEventListener('click', () => {
        resetState();
        ui.resetUI();
    });
});