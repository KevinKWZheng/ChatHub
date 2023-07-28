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
		return await this.cache.getConversation(conversationId);
	}

	public async sendMessage(text: string, model: ModelOptions, systemMessage?: string, conversationId?: string): Promise<ChatResponse> {
		let messages: Conversation = { conversation: [], id: `` };
		if (conversationId && conversationId.length) {
			messages = await this.cache.getConversation(conversationId);
		} else {
			messages = await this.cache.createConversation([]);
		}
		if (systemMessage)
			messages.conversation.push({ role: `system`, content: systemMessage });
		messages.conversation.push({ role: `user`, content: text });

		const response = await this.models.sendMessage(messages.conversation, model);
		if (response.status == `Success`) {
			messages.conversation = response.conversation;
			await this.cache.updateConversation(messages);
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
}