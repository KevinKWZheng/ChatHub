import { OpenAIApi, Configuration } from "openai";
import { Model } from "./Model";
import { GPTModels } from "./Model";

export function isGPTModel(model: string) {
	return GPTModels.includes(model as GPTModelFamily);
}

export class OpenAI extends Model {
	protected API: OpenAIApi;

	constructor(APIKey: string, model: GPTModelFamily) {
		if (!isGPTModel(model))
			throw new TypeError(`Model ${model} does not exist`);

		var subModel = ``;
		if (model == `ChatGPT`) subModel = `gpt-3.5-turbo`;
		else subModel = `gpt-4`;
		super(APIKey, model, subModel as GPTSubModelFamily);
		this.API = new OpenAIApi(new Configuration({
			apiKey: APIKey,
		}));
	}

	public async sendMessage(conversation: ConversationMessage[]): Promise<ModelResponse> {
		const timer = setTimeout(() => {
			throw new Error(`Request to OpenAI timed out`);
		}, 2 * 60 * 1000);
		try {
			const response = await this.API.createChatCompletion({
				messages: conversation,
				model: this.subModel,
			});
			clearTimeout(timer);
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
			clearTimeout(timer);
			return {
				status: `Error`,
				conversation: conversation,
				msg: JSON.stringify(err)
			};
		}
	}
}