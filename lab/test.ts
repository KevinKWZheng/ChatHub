import { ChatHub } from "../src/main";

const Hub = new ChatHub([
	{ model: `ChatGPT`, APIKey: `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` },
	{ model: `ChatPaLM2`, APIKey: `AIzaSyBqmeSM36fQGvayEtp-uTXHXCrzsJFbzT8` }
]);

const response = await Hub.sendMessage(`Hello there!`, `ChatGPT`);
console.log(response.text);
const response1 = await Hub.sendMessage(`Who are you?`, `ChatPaLM2`, undefined, response.conversationId);
console.log(response1.text);