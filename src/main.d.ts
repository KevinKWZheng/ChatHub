/* eslint-disable quotes */
declare module "chathub-adapter" {
	export class ChatHub {
		/**
		 * @param config an array of model name and APIKeys
		 * @param cacheOptions optional, set `useFile` as `true` to use local file system as cache.
		 */
		constructor(config: ModelConfig[], cacheOptions: {
			useFile: true,
			cacheDir: string,
			saveInterval: number
		});

		/**
		 * Send message to a LLM
		 * @param text Message from the user
		 * @param model The designated model you wish to speak to
		 * @param options A series of optional settings
		 */
		public sendMessage(text: string, model: ModelOptions, options?: ChatOptions): Promise<ChatResponse>;

		public hasModel(model: ModelOptions): boolean;

		public getAllModels(): Promise<IterableIterator<ModelOptions>>;

		public generateText(prompt: string): Promise<string>;
	}


	export class ConversationManager {
		constructor(cacheDir: string);

		public create(conversationMsg: ConversationMessage[]): Promise<Conversation>;

		public exportCopy(conversationId: string): Promise<Conversation>;

		protected save(conversation: Conversation): void;

		public has(conversationId: string): boolean;

		public update(conversation: Conversation): Promise<void>;

		public get(conversationId: string): Promise<Conversation>;

		public del(conversationId: string): Promise<string>;

		public import(conversation: Conversation): Promise<boolean>;

		public import(conversation: ConversationMessage[]): Promise<boolean>;
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