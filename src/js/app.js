/**
 * Main application entry point
 * Initializes and coordinates all MVC components
 */

import { SimpleChatModel } from "./model.js"
import { SimpleChatView } from "./view.js"
import { SimpleChatController } from "./controller.js"

/**
 * Initialize the chat application
 * Sets up MVC components and establishes their connections
 */
function initializeApp() {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Initialize Simple Chat...');

        // Instantiate MVC components
        const model = new SimpleChatModel();
        const view = new SimpleChatView();

        // Render the view in the #app container
        view.render('#app');

        // Link Everything through the Controller
        const controller = new SimpleChatController(model, view);
        controller.init();
    });
}

// Bootstrap the application
initializeApp();