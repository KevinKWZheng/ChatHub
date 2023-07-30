# ChatHub - Adapter

A simple-to-use, one-for-all SDK for interacting with trending LLM models.

## Key Features

- **All-In-One SDK:** use only one package to talk to ChatGPT, GPT-4, Claude-2, Claude-Instant, and PaLM at once

- **Universal conversation:** conversations may be used across different LLMs, e.g.switching from ChatGPT to Claude during one conversation.

- **Conversation storage:** conversations stored in local file system, with customizable cache directory and simple, black-boxed method for manipulation.

- **Conversation setup:** customize your conversation context for role-playing, scenario enacting .etc

## Installation & Use

### Install

Run `npm i chathub-adapter`.

### Use

To use this package, you will first need to import the `ChatHub` class and instantiate it.

```typescript
import { ChatHub } from "chathub-adapter";

const Hub = new ChatHub(
 // Required. If there are multiple models, load them all in the array
 [{ model: `YourModelNameHere`, APIKey: `YourAPIKeyHere` }],
 // Optional, customizable conversation cache directory, defaults to `data/conversations/`
 `data/conversations/`
);

// To send a message
const response =await Hub.sendMessage(`Hello there!`,`YourDesiredModel`);
// If you are using `ChatGPT`, you can expect `General Kenobi!`
console.log(response.text);

// Continuing a conversation
const anotherResponse=await Hub.sendMessage(`How are you?`,`YourDesiredModel`,{
 // Pass the corresponding `conversationId`
 conversationId:response.conversationId
});
console.log(anotherResponse.text);
```

### Types and Interfaces

Currently supported models: `ChatGPT`, `GPT-4`, `Claude-v1`, `Claude-v2`, `Claude-Instant`,`ChatPaLM2`.

Please note that this package will not grant you access to models you previously have no access to. e.g. Using this package will not allow you to use `GPT-4` if your account is not valid to use its API.

|Type Name|Allow Contents|
|:---:|:----|
|ModelOptions|Names of all supported models (case sensitive)|
|ChatOptions|Properties: `conversationId`, `context`, and `systemMessage`|
|ModelConfig|Configuration for your model, has two properties: `model` and `APIKey`.|
|Conversation|The interface in which conversation messages and their corresponding id|
|ConversationMessage|Properties: `role` and `content`. `role` allows `user`, `system`, and `assistant`; `content` is `string`|
|`conversationId`|A UUID v4 for identifying conversations|
|`context`|A general context in which the conversation takes place|
|`systemMessage`|A information-prompting message for LLM, used to provide contextual information that should not be mentioned by the user|

### Class and Methods

The main exported class for managing conversations and models is `ChatHub`.

`ChatHub` has the following public methods

#### Class `ChatHub`

|Method Name|Parameters|Return Value|Function|
|:-----:|:-----:|:-----:|:-----|
|constructor|`config`, `cacheDir`|An instance of `ChatHub`|Instantiate a `ChatHub` class|
|sendMessage|`text`,`model`,`options`|`ChatResponse`|Send your message to designated model|
|delConversation|`conversationId`|`void`|Delete a conversation designated by `conversationId`. If no such conversation exists, an error is thrown|
|exportConversation|`conversationId`|`Conversation`|Export conversation by `conversationId`|
|copyConversation|`conversationId`|`string`|Get a copy conversation to the conversation specified by `conversationId`. The `conversationId` of the newly copied conversation is returned.|
|getAllModels|none|`IterableIterator<ModelOptions>`|An iterator for all instantiated models|

-------
**This package is still being updated, star the GitHub repo to stay tuned!**
