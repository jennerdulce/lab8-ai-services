/**
 * Controller component that coordinates between Model and View
 * Handles event communication and business logic flow
 */
export class SimpleChatController {
    /**
     * Create a new SimpleChatController instance
     * @param {SimpleChatModel} model - The model instance
     * @param {SimpleChatView} view - The view instance
     */
    constructor(model, view) {
        /** @type {SimpleChatModel} Reference to the model */
        this.model = model;

        /** @type {SimpleChatView} Reference to the view */
        this.view = view;
    }

    /**
     * Initialize the controller and set up event listeners
     */
    init() {
        this.setupModelListeners();
        this.setupViewListeners();
    }

    /**
     * Set up event listeners for model events
     */
    setupModelListeners() {

        this.model.addEventListener('chatCleared', (e) => {
            this.view.clearChatMessages();
        });

        this.model.addEventListener('chatExported', (e) => {
            const message = e.detail.message;
            const exportedCount = e.detail.exportedMessages;
            alert(`${message}\n\nExported ${exportedCount} messages.`);
        });

        this.model.addEventListener('chatImported', (e) => {
            const importedMessages = e.detail.importedMessages;

            this.view.displayImportedMessages(importedMessages);
        });

        this.model.addEventListener('messageAdded', (e) => {
            const message = e.detail.message;
            const isUser = message.isUser
            this.view.appendMessageToChat(message, isUser);
        });


        this.model.addEventListener('messageDeleted', (e) => {
            const messageId = e.detail.messageId;
            this.view.removeMessageFromChat(messageId);
        });

        this.model.addEventListener('messageUpdated', (e) => {
            const message = e.detail.message;
            console.log('Controller received, message Updated:', message);
            this.view.updateMessageInChat(message.id, message.message);
        });

        this.model.addEventListener('providerChanged', (e) => {
            let messages = e.detail.messages

            this.view.displayImportedMessages(messages);
        });
    }

    /**
     * Set up event listeners for view events
     */
    setupViewListeners() {

        this.view.addEventListener('clearChat', (e) => {
            this.model.clearChat();
        });

        this.view.addEventListener('deleteMessage', (e) => {
            const messageId = e.detail.messageId;
            this.model.deleteMessage(messageId);
        });

        this.view.addEventListener('editMessage', (e) => {
            const messageId = e.detail.messageId;
            const newText = e.detail.newText;
            console.log('Controller received edit message:', messageId, newText);
            
            this.model.updateMessage(messageId, newText);
        });

        this.view.addEventListener('exportChat', (e) => {
            this.model.exportChat();
        });

        this.view.addEventListener('importChat', (e) => {
            const importedData = e.detail.importedData;
            this.model.importChat(importedData);
        });

        this.view.addEventListener('providerChange', (e) => {
            const provider = e.detail.provider;
            console.log(`Provider changed to: ${provider}`);

            if (provider) {
                // Switch model to new provider and load its data
                this.model.setProvider(provider);

            } else {
                console.log('No provider selected');

                // No provider selected, clear everything
                // On render, view will show no messages
                this.view.clearChatMessages();
            }
        });

        this.view.addEventListener('sendMessage', (e) => {
            const detailObj = e.detail;
            this.model.addMessage(detailObj.message, detailObj.isUser);
        });
    }
}

