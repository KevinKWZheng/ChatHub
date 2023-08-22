/* eslint-disable quotes */
declare module "chathub-adapter" {
	export class ChatHub {
		/**
		 * Initialization
		 * @param config an array of model name and APIKeys
		 * @param cacheDir optional, a designated directory for conversation caches, must end with `/`
		 */
		constructor(config: ModelConfig[], cacheDir?: string);

		/**
		 * Send message to a LLM
		 * @param text Message from the user
		 * @param model The designated model you wish to speak to
		 * @param options A series of optional settings
		 */
		sendMessage(text: string, model: ModelOptions, options?: ChatOptions): Promise<ChatResponse>;

		delConversation(conversationId: string): Promise<void>;

		exportConversation(conversationId: string): Promise<Conversation>;

		copyConversation(conversationId: string): Promise<string>;

		getAllModels(): Promise<IterableIterator<ModelOptions>>;
	}


	export class ConversationManager {
		constructor(cacheDir: string);

		public create(conversationMsg: ConversationMessage[]): Promise<Conversation>;

		public getCopy(conversationId: string): Promise<Conversation>;

		protected save(conversation: Conversation): void;

		public has(conversationId: string): boolean;

		public update(conversation: Conversation): Promise<void>;

		public get(conversationId: string): Promise<Conversation>;

		public del(conversationId: string): Promise<string>;
	}
}

/**
* The list of Available models, currently supports `ChatGPT`, `GPT-4`. `Claude-v1`, `Claude-v2`, `Claude-Instant`, `TextPaLM2`, and `ChatPaLM2`
*/
type ModelOptions = GPTModelFamily | ClaudeModelFamily | GoogleModelFamily;
type ConversationRole = `assistant` | `user` | `system`;

type GPTModelFamily = `ChatGPT` | `GPT-4`;
type ClaudeModelFamily = `Claude-v1` | `Claude-v2` | `Claude-Instant`;
type GoogleModelFamily = `TextPaLM2` | `ChatPaLM2`;

interface ConversationMessage {
	role: ConversationRole;
	content?: string;
}

interface Conversation {
	conversation: ConversationMessage[];
	id: string;
}

/**
 * Configuration for a LLM model
 */
interface ModelConfig {
	/**
	 * @description specify the name of the model, availability described in `ModelOptions`
	 */
	model: ModelOptions;
	/**
	 * Your API Key, provided by the backend of your service provider
	 */
	APIKey: string;
}

interface ChatResponse {
	status: `Success` | `Error`;
	model: ModelOptions;
	conversationId: string;
	text: string
}

interface ChatOptions {
	context?: string;
	systemMessage?: string;
	conversationId?: string;
}