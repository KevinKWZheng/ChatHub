import { OpenAIApi, Configuration } from "openai";
import { Base } from "./BaseClass";

//const GPTSubmodels = [`gpt-3.5-turbo`, `gpt-4`];
const GPTModels: GPTModelFamily[] = [`ChatGPT`, `GPT-4`];

function isGPTModel(model: string) {
	return GPTModels.includes(model as GPTModelFamily);
}

export class OpenAI extends Base {
	protected API: OpenAIApi;

	constructor(APIKey: string, model: GPTModelFamily) {
		if (!isGPTModel(model)) throw new TypeError(`Model does not exist`);
		var submodel = ``;
		if (model == `ChatGPT`) submodel = `gpt-3.5-turbo`;
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

		try {
			const response = await this.API.createChatCompletion({
				messages: conversation,
				model: this.subModel,
			});
			if (!response.data.choices[0].message) throw new Error(`Error: empty response`);
			conversation.push({
				role: `assistant`,
				content: response.data.choices[0].message?.content
			});
			return {
				status: `Success`,
				conversation: conversation
			};
		} catch (err) {
			this.logger.error(err);
			return {
				status: `Error`,
				conversation: conversation,
				msg: JSON.stringify(err)
			};
		}

	}
}