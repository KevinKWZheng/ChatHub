import { ChatHub } from "../src/main";

const Hub = new ChatHub([
	{ model: `ChatGPT`, APIKey: `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` }
]);

const response=await Hub.sendMessage(`Hello there!`,`ChatGPT`);

console.log(response.text);