interface ModelResponse {
	conversation: ConversationMessage[];
	status: `Success` | `Error`;
	msg?: string;
}

type GPTSubModelFamily = `gpt-3.5-turbo` | `gpt-4`;
type ClaudeSubModelFamily = `claude-1` | `claude-2` | `claude-instant-1`;
type GoogleSubModelFamily = `models/text-bison-001` | `models/chat-bison-001`;

interface ServerConfig {
	addr: string;
	port: number;
	modelConfig: ModelConfig[]
}