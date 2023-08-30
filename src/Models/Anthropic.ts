import Anthropic, { AI_PROMPT, HUMAN_PROMPT } from "@anthropic-ai/sdk";
import { Model } from "./Model";
import { ClaudeModels } from "./Model";

export function isClaudeModel(model: string) {
	return ClaudeModels.includes(model as ClaudeModelFamily);
}

export class Claude extends Model {
	protected API: Anthropic;
	constructor(APIKey: string, model: ClaudeModelFamily) {
		let subModel: ClaudeSubModelFamily = `claude-2`;
		if (!isClaudeModel(model))
			throw TypeError(`Model ${model} does not exist`);

		if (model == `Claude-v2`)
			subModel = `claude-2`;
		else subModel = `claude-instant-1`;
		super(APIKey, model, subModel);
		this.API = new Anthropic({
			apiKey: APIKey,
			maxRetries: 3
		});
	}
	public async sendMessage(conversation: ConversationMessage[]): Promise<ModelResponse> {
		let context = ``, systemPrompt = ``;
		for (const i in conversation) {
			switch (conversation[i].role) {
				case `assistant`:
					context += `\n\n${AI_PROMPT}${conversation[i].content}`;
					break;
				case `system`:
					systemPrompt = `<system>${conversation[i].content}<system>\n\n`;
					break;
				case `user`:
					context += `\n\n${HUMAN_PROMPT}`;
					if (systemPrompt) context += systemPrompt;
					context += conversation[i].content;
					break;
			}
		}

		const timer = setTimeout(() => {
			throw new Error(`Request to Claude (${this.subModel}) Timed out`);
		}, 2 * 60 * 1000);
		try {
			const response = await this.API.completions.create({
				prompt: context,
				max_tokens_to_sample: 450,
				model: this.subModel
			});
			clearTimeout(timer);
			conversation.push({
				role: `assistant`,
				content: response.completion
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