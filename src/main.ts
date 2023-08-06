import { ConversationManager } from "./ConversationManager";
import { ModelManager } from "./ModelManager";

export class ChatHub {
	protected models: ModelManager;
	protected cache: ConversationManager;

	constructor(config: ModelConfig[], cacheDir?: string) {
		this.models = new ModelManager(config);
		if (!cacheDir) cacheDir = `data/conversations/`;
		this.cache = new ConversationManager(cacheDir);
	}

	public async exportConversation(conversationId: string) {
		return await this.cache.get(conversationId);
	}

	public async delConversation(conversationId: string) {
		return await this.cache.del(conversationId);
	}

	public async copyConversation(conversationId: string) {
		const conversation = await this.cache.getCopy(conversationId);
		return conversation.id;
	}

	public hasConversation(conversationId: string) {
		return this.cache.has(conversationId);
	}

	public hasModel(model: ModelOptions) {
		return this.models.hasModel(model);
	}

	public getAllModels() {
		const models = this.models.listModels();
		return models;
	}

	public async sendMessage(text: string, model: ModelOptions, options?: ChatOptions): Promise<ChatResponse> {
		let messages: Conversation = { conversation: [], id: `` };
		if (options) {
			if (options.conversationId && options.conversationId.length) {
				messages = await this.cache.get(options.conversationId);
			} else {
				messages = await this.cache.create([]);
			}
			if (options.context) {
				messages.conversation.unshift({ role: `system`, content: options.context });
			}
			if (options.systemMessage)
				messages.conversation.push({ role: `system`, content: options.systemMessage });
		}
		messages.conversation.push({ role: `user`, content: text });

		const response = await this.models.sendMessage(messages.conversation, model);
		if (response.status == `Success`) {
			messages.conversation = response.conversation;
			await this.cache.update(messages);
			return {
				status: `Success`,
				text: messages.conversation[messages.conversation.length - 1].content as string,
				conversationId: messages.id,
				model: model
			};
		} else {
			return {
				status: `Error`,
				text: response.msg as string,
				conversationId: messages.id,
				model: model
			};
		}
	}

	public async generateText(prompt: string) {
		if (!this.hasModel(`TextPaLM2`))
			throw new Error(`This Method requires model TextPaLM2`);
		const response = await this.models.genText(prompt);
		return response;
	}
}