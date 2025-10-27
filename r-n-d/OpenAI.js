export function OpenAIMessage(message, isUser = false) {
    // return {
    //     id: Date.now().toString() + Math.random(),
    //     message: message,
    //     isUser: isUser,
    //     isEdited: false,
    //     provider: 'OpenAI'
    // };
    return {
        id: Date.now().toString() + Math.random(),
        message: "hello from OpenAI",
        isUser: isUser,
        isEdited: false,
        provider: 'OpenAI'
    }
}