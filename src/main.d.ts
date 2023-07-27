/* eslint-disable quotes */
declare module "ChatHub" {
	export class ChatHub {
		/**
		 * Initialization
		 * @param config an array of model name and APIKeys
		 * @param cacheDir optional, a designated directory for conversation caches, must end with `/`
		 */
		constructor(config: ModelConfig[], cacheDir?: string)
	}


}

/**
* The list of Available models
*/
type ModelOptions = GPTModelFamily | ClaudeModelFamily | GoogleModelFamily;
type ConversationRole = `assistant` | `user` | `system`;

type GPTModelFamily = `ChatGPT` | `GPT-4`;
type ClaudeModelFamily = `Claude-v1` | `Claude-v2` | `Claude-Instant`;
type GoogleModelFamily = `TextPaLM2` | `ChatPaLM2`;

type GPTSubModelFamily = `gpt-3.5-turbo` | `gpt-4`;
type ClaudeSubModelFamily = `claude-1` | `claude-2` | `claude-instant-1`;
type GoogleSubModelFamily = `models/text-bison-001` | `models/chat-bison-001`;


interface ConversationMessage {
	role: ConversationRole;
	content?: string;
}

interface ModelResponse {
	conversation: ConversationMessage[];
	status: `Success` | `Error`;
	msg?: string;
}

interface Conversation {
	conversation: ConversationMessage[];
	id: string;
}
interface ModelConfig {
	model: ModelOptions;
	APIKey: string;
}

interface ChatResponse {
	status: `Success` | `Error`;
	model: ModelOptions;
	conversationId: string;
	text: string
}