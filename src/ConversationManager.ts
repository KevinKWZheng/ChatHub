import * as fsSync from "fs";
import * as fsAsync from "fs/promises";
import { v4 as uuid, validate as isUuid } from "uuid";

export class ConversationManager {
	protected cacheDir: fsSync.PathLike;
	constructor(cacheDir: string) {
		if (!cacheDir.endsWith(`/`)) throw new Error(`Cache directory error: dir not ended with \`/\``);
		if (!fsSync.existsSync(cacheDir))
			fsSync.mkdirSync(cacheDir, { recursive: true });
		this.cacheDir = cacheDir;
	}

	public async createConversation(conversationMsg: ConversationMessage[]) {
		const conversation: Conversation = {
			conversation: conversationMsg,
			id: uuid()
		};
		await this.saveConversation(conversation);
		return conversation;
	}

	public async getCopyConversation(conversationId: string): Promise<Conversation> {
		const conversation = await this.getConversation(conversationId);
		conversation.id = uuid();
		await this.saveConversation(conversation);
		return conversation;
	}

	protected async saveConversation(conversation: Conversation) {
		await fsAsync.writeFile(`${this.cacheDir}${conversation.id}.json`,
			JSON.stringify(conversation), { encoding: `utf-8` });
	}

	public hasConversation(conversationId: string) {
		return fsSync.existsSync(`${this.cacheDir}${conversationId}.json`) && isUuid(conversationId);
	}

	public async updateConversation(conversation: Conversation) {
		if (!this.hasConversation(conversation.id))
			throw new Error(`Unknown conversation Id: ${conversation.id}`);
		return await this.saveConversation(conversation);
	}

	public async getConversation(conversationId: string): Promise<Conversation> {
		if (!this.hasConversation(conversationId))
			throw new Error(`Conversation Id does not exist: ${conversationId}`);
		const data = await fsAsync.readFile(`${this.cacheDir}${conversationId}.json`, { encoding: `utf-8` });
		return JSON.parse(data);
	}
}