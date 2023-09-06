import { ConversationManager } from "./ConversationManager";
import { ModelManager } from "./ModelManager";
import { Tokenizer } from "llm-tokenizer";

class ChatHub {
	protected modelManager: ModelManager;
	protected cache: Map<string, Conversation>;
	protected conversationManager: ConversationManager;
	protected tokenizer: Tokenizer;

	constructor(config: ModelConfig[], opts: {
		useFile: boolean,
		cacheDir: string,
		saveInterval: number,
		tokenizerEncoding: EncodingOptions
	} = {
			useFile: true,
			cacheDir: `data/conversations/`,
			saveInterval: 30 * 1000,
			tokenizerEncoding: `cl100k_base`
		}) {
		this.modelManager = new ModelManager(config);
		this.conversationManager = new ConversationManager(opts.useFile, opts);
		this.tokenizer = new Tokenizer(opts.tokenizerEncoding);
	}

	public hasModel(model: ModelOptions) {
		return this.modelManager.hasModel(model);
	}

	public getAllModels() {
		const models = this.modelManager.listModels();
		return models;
	}

	public async sendMessage(text: string, model: ModelOptions, options?: ChatOptions): Promise<ChatResponse> {
		let messages: Conversation = { conversation: [], id: `` };
		if (options) {
			if (options.conversationId && options.conversationId.length) {
				messages = await this.conversationManager.get(options.conversationId);
			} else {
				messages = await this.conversationManager.create([]);
			}
			if (options.context) {
				messages.conversation.unshift({ role: `system`, content: options.context });
			}
			if (options.systemMessage)
				messages.conversation.push({ role: `system`, content: options.systemMessage });
		}
		messages.conversation.push({ role: `user`, content: text });

		const response = await this.modelManager.sendMessage(messages.conversation, model);
		if (response.status == `Success`) {
			messages.conversation = response.conversation;
			await this.conversationManager.update(messages);
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
		const response = await this.modelManager.genText(prompt);
		return response;
	}

	public async setEncoding(opts: {
		encodingName?: EncodingOptions,
		modelName?: string
	}) {
		return await this.tokenizer.setEncoding(opts);
	}

	public async countToken(text: string) {
		return await this.tokenizer.countToken(text);
	}

	public async countConversationToken(conversationId: string) {
		const conversation = await this.conversationManager.get(conversationId);
		return await this.tokenizer.countChatToken(conversation as unknown as { role: `system` | `user` | `assistant`, content: string }[]);
	}
}

export { ChatHub, ConversationManager };