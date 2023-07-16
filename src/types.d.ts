/**
 * The list of Available models
 */
type ModelOptions = GPTModelFamily | ClaudeModelFamily | GoogleModelFamily;
type ConversationRole = `assistant` | `user` | `system`;

type GPTModelFamily = `ChatGPT` | `GPT-4`;
type ClaudeModelFamily = `Claude-v1` | `Claude-v2` | `Claude-Instant`;
type GoogleModelFamily = `PaLM2`;

type GPTSubModelFamily = `gpt-3.5-turbo` | `gpt4`;
type ClaudeSubModelFamily = `claude-2` | `claude-instant-1`;
type GoogleSubModelFamily = `models/text-bison-001` | `models/chat-bison-001`;


interface ConversationMessage {
	role: ConversationRole;
	content?: string;
}

interface ChatResponse {
	conversation: ConversationMessage[];
	status: `Success` | `Error`;
	msg?: string;
}