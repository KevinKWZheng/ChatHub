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

	public async create(conversationMsg: ConversationMessage[]) {
		const conversation: Conversation = {
			conversation: conversationMsg,
			id: uuid()
		};
		await this.save(conversation);
		return conversation;
	}

	public async getCopy(conversationId: string): Promise<Conversation> {
		const conversation = await this.get(conversationId);
		conversation.id = uuid();
		await this.save(conversation);
		return conversation;
	}

	protected async save(conversation: Conversation) {
		await fsAsync.writeFile(`${this.cacheDir}${conversation.id}.json`,
			JSON.stringify(conversation), { encoding: `utf-8` });
	}

	public has(conversationId: string) {
		return fsSync.existsSync(`${this.cacheDir}${conversationId}.json`) && isUuid(conversationId);
	}

	public async update(conversation: Conversation) {
		if (!this.has(conversation.id))
			throw new Error(`Unknown conversation Id: ${conversation.id}`);
		return await this.save(conversation);
	}

	public async get(conversationId: string): Promise<Conversation> {
		if (!this.has(conversationId))
			throw new Error(`Conversation Id does not exist: ${conversationId}`);
		const data = await fsAsync.readFile(`${this.cacheDir}${conversationId}.json`, { encoding: `utf-8` });
		return JSON.parse(data);
	}

	public async del(conversationId: string) {
		if (!this.has(conversationId))
			throw new Error(`Unknown conversation Id: ${conversationId}`);
		await fsAsync.unlink(`${this.cacheDir}${conversationId}.json`);
	}
}