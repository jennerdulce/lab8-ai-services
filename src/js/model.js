/**
 * Model component for chat application data management
 * Handles CRUD operations, localStorage persistence, and event dispatching
 */
export class SimpleChatModel extends EventTarget {
    /**
     * Create a new SimpleChatModel instance
     */
    constructor() {
        super();

        /** @type {Array<Object>} Array of chat messages */
        this.messages = [];

        /** @type {boolean} Debug logging flag */
        this.DEBUG = true;

        /** @type {string} Current active provider */
        this.currentProvider = null;

        // Don't load any chat on startup - wait for provider selection
    }

    /**
     * Log debug messages when DEBUG is enabled
     * @param {string} msg - Message to log
     */
    log(msg) {
        if (this.DEBUG) console.log(msg);
    }

    /**
     * Set the current provider and load its chat history
     * @param {string} provider - The provider to switch to (eliza, claude, openai)
     */
    setProvider(provider) {
        if (provider) {
            this.currentProvider = provider;
            this.loadFromLocalStorage(provider);
            this.log(`Switched to provider: ${provider}`);
            this.dispatchProviderChanged(this.messages);
        }
    }

    /**
     * Get the localStorage key for a specific provider
     * @param {string} provider - The provider name
     * @returns {string} The localStorage key
     */
    getStorageKey(provider) {
        return `chatHistory_${provider}`;
    }

    /**
     * Load messages from localStorage for a specific provider
     * @param {string} provider - The provider to load data for
     */
    loadFromLocalStorage(provider = this.currentProvider) {
        if (!provider) {
            this.messages = [];
            return;
        }

        try {
            const storageKey = this.getStorageKey(provider);
            const chatHistory = localStorage.getItem(storageKey);

            if (chatHistory) {
                this.messages = JSON.parse(chatHistory);
                this.log(`Model loaded ${this.messages.length} messages from ${storageKey}`);

            } else {
                this.messages = [];
                this.log(`No chat history found for ${storageKey}... creating new chat session.`);
            }

        } catch (error) {
            console.error(`Error loading chat history for provider ${provider}:`, error);
            this.messages = []; // Reset to empty array on error
        }
    }

    /**
     * Add a new message to the chat
     * @param {string} messageText - The message content
     * @param {boolean} isUser - Whether the message is from the user
     * @param {boolean} [isEdited=false] - Whether the message has been edited
     */
    addMessage(messageText, isUser, isEdited = false) {
        this.log("Adding message to localStorage: ", messageText);

        const message = {
            id: Date.now().toString() + Math.random(),
            message: messageText,
            isUser: isUser,
            timestamp: new Date().toISOString(),
            isEdited: isEdited
        };

        this.messages.push(message);
        this.saveToLocalStorage();
        this.dispatchMessageAdded(message);
        this.log("Message added: ", message);
    }

    /**
     * Update an existing message
     * @param {string} messageId - The message ID to update
     * @param {string} newMessage - The new message content
     */
    updateMessage(messageId, newMessage) {
        this.log("Model updating message with ID:", messageId, "New text:", newMessage);

        // Find message in array
        const messageIndex = this.messages.findIndex(message => message.id === messageId);
        this.log("Found message at index:", messageIndex);

        if (messageIndex !== -1) {
            // Update message content and mark as edited
            this.messages[messageIndex].message = newMessage;
            this.messages[messageIndex].isEdited = true;
            this.messages[messageIndex].editedAt = new Date().toISOString();

            this.log("Updated message:", this.messages[messageIndex]);

            // Update localStorage
            this.saveToLocalStorage();

            // Dispatch update event
            this.dispatchMessageUpdated(this.messages[messageIndex]);

            this.log(`Message ${messageId} updated successfully`);

        } else {
            console.warn(`Message with ID ${messageId} not found`);
        }
    }

    /**
     * Delete a message by ID
     * @param {string} messageId - The message ID to delete
     */
    deleteMessage(messageId) {
        this.log("Deleting message with ID:", messageId);

        // Find and remove message from array
        const messageIndex = this.messages.findIndex(message => message.id === messageId);

        if (messageIndex !== -1) {
            // Remove message from array
            this.messages.splice(messageIndex, 1);

            // Update localStorage
            this.saveToLocalStorage();

            // Dispatch delete event
            this.dispatchMessageDeleted(messageId);

            this.log(`Message ${messageId} deleted successfully`);

        } else {
            console.warn(`Message with ID ${messageId} not found`);
        }
    }

    /**
     * Clear all chat messages
     */
    clearChat() {
        this.log("Clearing chat messages on localStorage.. ");

        // Clear the messages array
        this.messages = [];

        // Remove from localStorage
        if (this.currentProvider) {
            try {
                const storageKey = this.getStorageKey(this.currentProvider);
                localStorage.removeItem(storageKey);
                this.log(`Chat history removed from ${storageKey}`);

            } catch (e) {
                console.error(`Error clearing localStorage: ${e}`);
            }
        }

        // Dispatch event to notify that chat was cleared
        this.dispatchChatCleared();
    }

    /**
     * Export chat messages to a file
     */
    exportChat() {
        // Create simple JSON string of messages
        const jsonString = JSON.stringify(this.messages);

        // Create and download text file
        const blob = new Blob([jsonString], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'chat-export.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        this.log('Chat exported as text file');

        // Dispatch export success event
        this.dispatchChatExported();
    }

    /**
     * Import chat messages from data
     * @param {Array<Object>} importedData - Array of message objects to import
     */
    importChat(importedData) {
        try {
            this.log("Importing chat messages:", importedData);

            // Clear current messages
            this.messages = [];

            // Import the messages (assuming importedData is an array of messages)
            if (Array.isArray(importedData)) {
                this.messages = importedData;
            } else {
                throw new Error("Invalid data format: expected an array of messages");
            }

            // Save to localStorage
            this.saveToLocalStorage();

            // Dispatch events for each imported message to update the UI
            this.messages.forEach(message => {
                this.dispatchMessageAdded(message);
            });

            // Dispatch import completion event
            this.dispatchChatImported();

            this.log(`Successfully imported ${this.messages.length} messages`);

        } catch (error) {
            console.error("Error importing chat:", error);
            alert("Error importing chat: " + error.message);
        }
    }

    /**
     * Save messages to localStorage for the current provider
     */
    saveToLocalStorage() {
        if (!this.currentProvider) {
            this.log("No provider set, skipping save");
            return;
        }

        try {
            const storageKey = this.getStorageKey(this.currentProvider);
            localStorage.setItem(storageKey, JSON.stringify(this.messages));
            this.log(`Chat history saved to ${storageKey}`);

        } catch (e) {
            console.error(`Error saving to storage: ${e}`)
        }
    }

    /**
     * Dispatch message added event
     * @param {Object} message - The message object that was added
     */
    dispatchMessageAdded(message) {
        this.dispatchEvent(new CustomEvent('messageAdded', {
            detail: { message }
        }))
    }

    /**
     * Dispatch message updated event
     * @param {Object} message - The message object that was updated
     */
    dispatchMessageUpdated(message) {
        this.log('Model dispatching messageUpdated event:', message);

        this.dispatchEvent(new CustomEvent('messageUpdated', {
            detail: { message }
        }))
    }

    /**
     * Dispatch message deleted event
     * @param {string} messageId - The ID of the deleted message
     */
    dispatchMessageDeleted(messageId) {
        this.dispatchEvent(new CustomEvent('messageDeleted', {
            detail: { messageId }
        }))
    }

    /**
     * Dispatch chat cleared event
     */
    dispatchChatCleared() {
        this.dispatchEvent(new CustomEvent('chatCleared', {
            detail: {
                message: "Chat has been cleared successfully"
            }
        }));
    }

    /**
     * Dispatch chat exported event
     */
    dispatchChatExported() {
        this.dispatchEvent(new CustomEvent('chatExported', {
            detail: {
                message: "Chat exported successfully! File downloaded to your Downloads folder.",
                exportedMessages: this.messages.length
            }
        }))
    }

    /**
     * Dispatch chat imported event
     */
    dispatchChatImported() {
        this.dispatchEvent(new CustomEvent('chatImported', {
            detail: {
                message: "Chat imported successfully",
                importedMessages: this.messages
            }
        }));
    }

    dispatchProviderChanged(messages) {
        this.dispatchEvent(new CustomEvent('providerChanged', {
            detail: { messages }
        }));
    }
}

