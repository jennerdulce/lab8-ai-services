export function ClaudeMessage(message, isUser = false) {
    // return {
    //     id: Date.now().toString() + Math.random(),
    //     message: message,
    //     isUser: isUser,
    //     isEdited: false,
    //     provider: 'claude'
    // };
    return {
        id: Date.now().toString() + Math.random(),
        message: "hello from claude",
        isUser: isUser,
        isEdited: false,
        provider: 'claude'
    }
}