import { Model, GoogleModels } from './Model';
import { GoogleAuth } from 'google-auth-library';
import { TextServiceClient, DiscussServiceClient } from "@google-ai/generativelanguage";

export function isGoogleModel(model: string) {
	return GoogleModels.includes(model as GoogleModelFamily);
}

export class PaLM extends Model {
	protected textApi: TextServiceClient;
	protected chatApi: DiscussServiceClient;

	constructor(APIKey: string, model: GoogleModelFamily) {
		var subModel: GoogleSubModelFamily = `models/chat-bison-001`;
		if (!isGoogleModel(model))
			throw new TypeError(`Model ${model} does not exist`);
		if (model == `ChatPaLM2`)
			subModel = `models/chat-bison-001`;
		else subModel = `models/text-bison-001`;
		super(APIKey, model, subModel);
		const auth = new GoogleAuth().fromAPIKey(this.APIKey);
		if (model == `ChatPaLM2`)
			this.chatApi = new DiscussServiceClient({ authClient: auth });
		if (model == `TextPaLM2`)
			this.textApi = new TextServiceClient({ authClient: auth });
	}

	public async sendMessage(conversation: ConversationMessage[]): Promise<ModelResponse> {
		if (!this.chatApi) throw new Error(`Incorrect model`);
		let context = ``;
		const messages: { content: string }[] = [];
		for (const i in conversation) {
			if (conversation[i].role == `system`)
				context += `<system>${conversation[i].content}</system>\n\n`;
			else
				messages.push({ content: conversation[i].content as string });
		}

		const timer = setTimeout(() => {
			throw new Error(`Request to PaLM timed out`);
		}, 2 * 60 * 1000);
		try {
			const response = await this.chatApi.generateMessage({
				model: this.subModel,
				prompt: {
					context: context,
					messages: messages
				},
				temperature: 0.5
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			}) as any;
			clearTimeout(timer);
			if (response[0] && response[0].messages[0])
				conversation.push({ role: `assistant`, content: response[0].messages[0].content });
			else throw new Error(`Empty response from PaLM`);
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

	public async genText(prompt: string) {
		const results = await this.textApi.generateText({
			model: this.subModel,
			prompt: {
				text: prompt
			},
			temperature: 0.75,
			safetySettings: [
				{ category: `HARM_CATEGORY_SEXUAL`, threshold: `BLOCK_LOW_AND_ABOVE` },
				{ category: `HARM_CATEGORY_DANGEROUS`, threshold: `BLOCK_LOW_AND_ABOVE` },
				{ category: `HARM_CATEGORY_VIOLENCE`, threshold: `BLOCK_MEDIUM_AND_ABOVE` },
				{ category: `HARM_CATEGORY_DEROGATORY`, threshold: `BLOCK_MEDIUM_AND_ABOVE` }
			]
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		}) as any;
		return results[0].candidates[0].output as string;
	}
}