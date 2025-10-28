# AI Services Chat Application with MVC Architecture

**Live Demo**: [Lab 8: AI Services Integration by Jenner Dulce](https://lab8-ai-services-jdd.netlify.app/)
**Repo**: [jennerdulce/lab8-ai-services](https://github.com/jennerdulce/lab8-ai-services)

## Overview

A sophisticated AI-powered chat application built using the Model-View-Controller (MVC) architectural pattern, featuring multiple AI service providers, secure API key management, and comprehensive end-to-end testing. This application demonstrates professional software engineering practices for building maintainable, testable AI applications.

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Features](#features)
- [How to Use](#how-to-use)
- [MVC Architecture](#mvc-architecture)
- [AI Service Integration](#ai-service-integration)
- [Installation & Setup](#installation--setup)
- [Testing](#testing)
- [Technical Decisions & Trade-offs](#technical-decisions--trade-offs)
- [Security Considerations](#security-considerations)
- [Resources](#resources)
- [Learning Objectives Achieved](#learning-objectives-achieved)

## Project Structure

```
lab8-ai-services/
├── src/
│   ├── index.html              # Main HTML file
│   ├── styles.css              # Application styles
│   ├── reset.css               # CSS reset
│   ├── js/
│   │   ├── app.js              # Application entry point
│   │   ├── model.js            # Data model with provider isolation
│   │   ├── view.js             # UI component with provider selection
│   │   ├── controller.js       # Business logic coordination
│   │   └── eliza.js            # Local Eliza chatbot logic
│   └── r-n-d/                  # Research & Development
│       ├── Claude.js           # Anthropic Claude API integration
│       ├── OpenAI.js          # OpenAI GPT API integration
│       └── Eliza.js           # Enhanced Eliza implementation
├── e2e/                        # End-to-end tests
│   ├── basic-functionality.spec.js    # Core app functionality tests
│   ├── eliza-provider.spec.js         # Eliza-specific tests
│   ├── claude-provider.spec.js        # Claude integration tests
│   └── openai-provider.spec.js        # OpenAI integration tests
├── netlify.toml                # Netlify deployment configuration
├── playwright.config.js       # Playwright test configuration
├── package.json               # Node.js dependencies
└── README.md                   # Project documentation
```

### Key Files

- **`app.js`**: Application bootstrap and MVC component initialization
- **`model.js`**: Manages chat data with provider-specific storage isolation
- **`view.js`**: Handles UI, provider selection, and AI-specific response handling
- **`controller.js`**: Coordinates provider switching and async operations
- **`src/r-n-d/`**: AI service implementations with both mock and real API integrations

## Features

### AI Service Integration
- **Multiple AI Providers**: Switch between Eliza (local), Claude (Anthropic), and OpenAI GPT
- **Provider Isolation**: Separate chat histories for each AI provider
- **Async Operations**: Proper handling of API calls with async/await patterns
- **Mock Mode**: Development-friendly testing without API costs
- **Real API Integration**: Production-ready API calls with proper error handling

### Enhanced Chat Functionality
- **Provider Selection**: Dropdown menu to choose between AI services
- **Intelligent Responses**: Each provider offers unique response characteristics
- **Provider-Aware Export**: File exports include provider information
- **Import Validation**: Smart chat import with provider compatibility checks
- **Message Persistence**: Provider-specific localStorage management

### CRUD Operations
- **Create**: Add messages with provider-specific processing
- **Read**: Load chat history per provider / display AI response
- **Update**: Edit messages within provider context
- **Delete**: Remove messages from correct provider history

### Testing & Quality Assurance
- **End-to-End Testing**: Comprehensive Playwright test suite
- **Provider-Specific Tests**: Dedicated tests for each AI service
- **Mock Testing**: Controlled testing environment for reliable results
- **Cross-Browser Support**: Tests run on Chromium, Firefox, and Safari

## How to Use
### Local Development

1. **Clone the Repository**
   ```bash
   git clone https://github.com/jennerdulce/lab8-ai-services.git
   cd lab8-ai-services
   open .
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Local Server**
   - Navigate to src > index.html
   - Run live server in VSCode

4. Replace API_KEY for Claude and OpenAI providers

5. Change DEBUG variable to false for Claude and OpenAI providers

6. Open a chrome window with this command in the terminal to bypass CORS and reach AI API endpoints

```bash
open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_cors" --disable-web-security --disable-features=VizDisplayCompositor --disable-site-isolation-trials
```

### Basic Operations

1. **Select AI Provider**
   - Use the dropdown menu to choose between Eliza, Claude, or OpenAI
   - Each provider maintains separate chat histories
   - Switch providers anytime to compare responses

2. **Chat Interaction**
   - Type messages in the user textarea
   - Press Enter or click Send
   - Experience different response styles from each AI provider

3. **Provider-Specific Features**
   - **Eliza**: Immediate, pattern-based responses
   - **Claude**: Mock responses with 1-second delay (DEBUG mode)
   - **OpenAI**: Mock responses with 500ms delay (DEBUG mode)

### CORS Bypass for Real API Calls

For development with real API endpoints:

```bash
# macOS Chrome with CORS disabled
open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_cors" --disable-web-security --disable-features=VizDisplayCompositor --disable-site-isolation-trials
```

## MVC Architecture

### Model (`model.js`)
**Enhanced Responsibilities:**
- Provider-specific data management
- Isolated localStorage per AI service
- Provider switching logic
- Export/import with provider metadata

**Key Features:**
```javascript
// Provider-specific storage
getStorageKey(provider) {
    return `chatHistory_${provider}`;
}

// Provider switching with data isolation
setProvider(provider) {
    this.currentProvider = provider;
    this.loadFromLocalStorage(provider);
    this.dispatchProviderChanged(this.messages);
}
```

### View (`view.js`)
**Enhanced Responsibilities:**
- AI provider selection interface
- Provider-specific response handling
- Async response timing management
- Provider-aware UI updates

**Key Features:**
- Provider dropdown integration
- Async response handling with different delays
- Provider validation before message sending
- Dynamic response routing based on selected provider

### Controller (`controller.js`)
**Enhanced Responsibilities:**
- Provider change coordination
- Async operation management
- Cross-provider data synchronization
- Event handling for provider switching

## AI Service Integration

### Service Abstraction Pattern

The application implements a clean abstraction layer for AI services:

```javascript
// Provider-specific response generation
async getBotResponseByProvider(message) {
    const selectedProvider = this.getSelectedProvider();
    
    switch (selectedProvider) {
        case 'eliza':
            return getElizaResponse(message);
        case 'claude':
            return await getClaudeResponse(message);
        case 'openai':
            return await getOpenAIResponse(message);
        default:
            return "Please select an AI provider to get a response.";
    }
}
```

### Provider Implementations

#### Eliza (Local)
- **Type**: Synchronous, rule-based
- **Response Time**: Immediate
- **Characteristics**: Pattern matching, therapeutic responses
- **Use Case**: Development, privacy-focused scenarios

#### Claude (Anthropic)
- **Type**: Asynchronous, cloud-based LLM
- **Response Time**: 1-second mock delay
- **Characteristics**: Thoughtful, detailed responses
- **Use Case**: Production scenarios requiring nuanced AI

#### OpenAI GPT
- **Type**: Asynchronous, cloud-based LLM  
- **Response Time**: 500ms mock delay
- **Characteristics**: Versatile, creative responses
- **Use Case**: General-purpose AI applications

### Model Selection & Specifications

#### Claude Model Configuration
- **Model**: `claude-3-5-sonnet-20241022`
- **Selection Rationale**: Balanced performance between capability and cost
- **Characteristics**: Excellent reasoning abilities with thoughtful, nuanced responses
- **Best For**: Complex conversations requiring deep understanding and analysis

#### OpenAI Model Configuration  
- **Model**: `gpt-4o-mini`
- **Selection Rationale**: Most cost-effective option in the GPT-4 family
- **Characteristics**: Fast, efficient responses with strong general knowledge
- **Best For**: Quick interactions and general-purpose conversations where cost optimization is important

### Mock vs Production Modes

Each cloud provider supports both testing and production modes:

```javascript
// Development mode with mocks
let DEBUG = true;
if (DEBUG) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `Claude says: I received your message "${userMessage}". This is a mock response for testing.`;
}

// Production mode with real API calls
const response = await fetch('https://api.anthropic.com/v1/messages', {
    // Real API implementation
});
```

## Installation & Setup

### Prerequisites
- Node.js (for Playwright testing)
- Python 3 (for local server)
- Modern web browser

### Development Setup

1. **Install Playwright**
   ```bash
   npm install @playwright/test
   npx playwright install
   ```

2. **Environment Configuration**
   - Set `DEBUG = true` in AI provider files for mock mode
   - For production: Configure API keys and set `DEBUG = false`

3. **API Key Management** (Production)
   ```javascript
   // Secure API key handling
   const API_KEY = process.env.CLAUDE_API_KEY; // Server-side
   // or
   const API_KEY = prompt('Enter your API key'); // Client-side (development only)
   ```

## Testing

### Running Tests

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test e2e/eliza-provider.spec.js

# Run with UI mode
npx playwright test --ui
```

### Test Coverage

#### Basic Functionality Tests
- Interface loading and element presence
- Provider selection requirements
- Navigation and core features

#### Provider-Specific Tests
- **Eliza**: Pattern matching and response generation
- **Claude**: Mock response timing and content validation
- **OpenAI**: Async handling and provider isolation

#### Integration Tests
- Provider switching with data isolation
- Export functionality with provider metadata
- Edit/delete operations across providers

### Test Architecture

```javascript
// Mock-based testing for predictable results
test('should respond with mock Claude response', async ({ page }) => {
    const testMessage = 'Hello Claude, how are you?';
    await page.fill('#user-input', testMessage);
    await page.click('#send-btn');
    
    const botResponse = await page.locator('#message-container .bot-output .message-text').textContent();
    expect(botResponse).toContain('Claude says: I received your message');
    expect(botResponse).toContain('This is a mock response for testing');
});
```

## Technical Decisions & Trade-offs

### Architecture Decisions

#### Provider Isolation
**Decision**: Separate localStorage for each AI provider
**Rationale**: Prevents data mixing and enables provider-specific features
**Trade-off**: Increased storage complexity vs. cleaner data separation

#### Async/Await Implementation
**Decision**: Full async/await pattern for all AI providers
**Rationale**: Consistent interface regardless of provider type
**Trade-off**: Slight overhead for synchronous providers vs. unified API

#### Mock-First Testing
**Decision**: Use mock responses for automated testing
**Rationale**: Predictable, cost-effective, and fast test execution
**Trade-off**: Less real-world validation vs. reliable CI/CD pipeline

### Service Layer Benefits

1. **Swappable Providers**: Easy to add new AI services
2. **Testing Isolation**: Mock any provider independently
3. **Configuration Management**: Provider-specific settings
4. **Error Handling**: Consistent error patterns across providers

## Security Considerations

### API Key Management

**Development Approach** (Current):
- User input for API key
    - Cost effective and protected
- localStorage
- CORS bypass for direct API calls

**Production Recommendations**:
- Server-side proxy for API calls
- Environment variable management
- Request rate limiting and validation

### CORS Handling

**Current Implementation**: Browser CORS bypass for development
**Production Alternative**: Server-side proxy or CORS-enabled endpoints

### Data Privacy

- Provider isolation prevents data leakage
- Local Eliza option for privacy-sensitive scenarios
- Clear user choice between local and cloud processing

## Resources

- [Fetch API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Anthropic Claude API Documentation](https://docs.anthropic.com/)
- [Async/Await - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [Playwright Documentation](https://playwright.dev/)
- [Dependency Injection - Martin Fowler](https://martinfowler.com/articles/injection.html)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)

## Learning Objectives Achieved

### ✅ AI Service Provider Evaluation
- Researched and evaluated multiple LLM providers
- Implemented trade-off analysis between local vs. cloud processing
- Created abstraction layer for provider swapping

### ✅ Architectural Patterns
- Implemented Port-Adapter pattern for AI service abstraction
- Used dependency injection principles for provider management
- Maintained clean separation of concerns in MVC architecture

### ✅ HTTP API Integration
- Made HTTP API calls using Fetch API
- Implemented proper error handling for network requests
- Managed API responses with different data structures

### ✅ Asynchronous Programming
- Mastered async/await patterns for API calls
- Handled different response timing across providers
- Implemented proper error handling in async contexts

### ✅ End-to-End Testing
- Created comprehensive Playwright test suite
- Implemented mock-based testing for reliable results
- Achieved cross-browser compatibility testing

### ✅ Security Best Practices
- Implemented API key management strategies
- Understood production vs. development security considerations
- Learned about CORS implications and solutions

## Reflection

## Reflection

### Technical Challenges

**Provider State Management**: The biggest challenge was implementing separate chat histories for each AI provider. Initially tried passing provider as an argument through the entire app, but this created tight coupling. Solved it using React-inspired state management - storing provider state in the model layer and using event-driven updates.

**Async Integration**: Mixing synchronous (Eliza) and asynchronous (Claude/OpenAI) providers required a unified interface. Implemented `getBotResponseByProvider()` with consistent async patterns across all providers, even making Eliza async for consistency.

**CORS Issues**: Real API calls hit CORS restrictions. Used browser CORS bypass for development, but learned this highlights the need for backend proxies in production.

### Architecture Decisions

**Data Isolation**: Used provider-prefixed localStorage keys (`chatHistory_${provider}`) to separate chat data. This enabled provider-specific exports and CRUD operations without complex data management.

**MVC Adaptation**: The existing MVC pattern handled multi-provider requirements well. Provider switching became a natural extension of the event-driven architecture.

### Testing Experience

**Playwright vs Jest/Mocha**: Coming from unit testing frameworks, Playwright's browser automation was different but powerful. Testing real user interactions rather than just function outputs provided better confidence in the app.

**Mock Strategy**: Used mock responses instead of real API calls for tests. This made tests faster, cheaper, and more reliable while still validating the core functionality.

### Key Learnings

- **API Integration**: Learned to work with different API patterns (Anthropic vs OpenAI) and handle async operations properly
- **Security**: Understood client-side API key limitations and the need for server-side proxies in production
- **Architecture**: Applied port-adapter pattern for clean service abstraction and maintainable code

Building a multi-provider AI chatbot that actually works was satisfying. The project successfully bridges academic concepts with real-world development practices.