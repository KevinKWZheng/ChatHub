import { OpenAIApi, Configuration } from "openai";
import { Base } from "./BaseClass";

const GPTSubmodels = [`gpt-3.5-turbo`, `gpt-4`];
const GPTModels: GPTModelFamily[] = [`ChatGPT`, `GPT-4`]

function isGPTModel(model: string) {
	return GPTModels.includes(model as GPTModelFamily);
}

class OpenAI extends Base {
	protected API: OpenAIApi;

	constructor(APIKey: string, model: GPTModelFamily) {
		if (!isGPTModel(model)) throw new TypeError;
		var submodel = '';
		if (model == `ChatGPT`) submodel = `gpt-3.5-turbo`
		else submodel = `gpt-4`;
		super(APIKey, model, submodel as GPTSubModelFamily);
		this.API = new OpenAIApi(new Configuration({
			apiKey: APIKey,
		}));
	}

	public async sendMessage(text: string, conversation: ConversationMessage[], systemMessage?: string): Promise<ChatResponse> {
		if (!conversation) conversation = [];
		if (systemMessage) conversation.push({ role: `system`, content: systemMessage });

		conversation.push({ role: `user`, content: text });

		const response = await this.API.createChatCompletion({
			messages: conversation,
			model: this.subModel,
		}, {
			timeout: 60 * 1000
		});
		if (!response.data.choices[0].message) throw new Error(`Error: empty response`);
		conversation.push({
			role: `assistant`,
			content: response.data.choices[0].message?.content
		});
		return {
			status: `Success`,
			conversation: conversation
		}
	}
}