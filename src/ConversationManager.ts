import * as fsSync from "fs";
import * as fsAsync from "fs/promises";
import { v4 as uuid, validate as isUuid } from "uuid";

export class ConversationManager {
	protected cacheDir: fsSync.PathLike;
	protected cache: Map<string, Conversation>;
	protected intervalTimer: NodeJS.Timer;

	constructor(cacheToFile: boolean, options = {
		/**
		 * The directory in which the conversations are cached. Must end with `/`
		 */
		cacheDir: `data/conversations/`,
		/**
		 * The interval of which the conversation cache will be written into files. Number written in m
		 */
		saveInterval: 30 * 1000,
	}) {
		this.cache = new Map();

		if (cacheToFile) {
			if (!options.cacheDir.endsWith(`/`)) throw new Error(`Cache directory error: dir not ended with \`/\``);
			if (!fsSync.existsSync(options.cacheDir))
				fsSync.mkdirSync(options.cacheDir, { recursive: true });
			this.cacheDir = options.cacheDir;
			this.intervalTimer = setInterval(this.periodicUpdate.bind(this), options.saveInterval);
		}
	}

	public async create(conversationMsg: ConversationMessage[]) {
		const conversation: Conversation = {
			conversation: conversationMsg,
			id: uuid()
		};
		await this.save(conversation);
		return conversation;
	}

	public async exportCopy(conversationId: string): Promise<Conversation> {
		const conversation = await this.get(conversationId);
		conversation.id = uuid();
		await this.save(conversation);
		return conversation;
	}

	protected async save(conversation: Conversation) {
		this.cache.set(conversation.id, conversation);
		if (this.cacheDir)
			await fsAsync.writeFile(`${this.cacheDir}${conversation.id}.json`,
				JSON.stringify(conversation), { encoding: `utf-8` });
	}

	public has(conversationId: string) {
		return isUuid(conversationId) && (this.cache.has(conversationId) ||
			((fsSync.existsSync(`${this.cacheDir}${conversationId}.json`) && this.cacheDir) || (!this.cacheDir)));
	}

	public async update(conversation: Conversation) {
		if (!this.has(conversation.id))
			throw new Error(`Unknown conversation Id: ${conversation.id}`);
		return await this.save(conversation);
	}

	public async get(conversationId: string): Promise<Conversation> {
		if (!this.has(conversationId))
			throw new Error(`[System] Conversation id ${conversationId} does not exist.`);
		if (this.cache.has(conversationId))
			return this.cache.get(conversationId) as Conversation;
		else {
			const data = await fsAsync.readFile(`${this.cacheDir}${conversationId}.json`, { encoding: `utf-8` });
			return JSON.parse(data);
		}
	}

	public async del(conversationId: string) {
		if (!this.has(conversationId))
			return null;
		this.cache.delete(conversationId);
		if (this.cacheDir) {
			if (fsSync.existsSync(`${this.cacheDir}${conversationId}.json`))
				await fsAsync.unlink(`${this.cacheDir}${conversationId}.json`);
		}
		return conversationId;
	}

	public async import(conversation: Conversation) {
		if (this.has(conversation.id))
			return false;
		await this.save(conversation);
	}

	protected periodicUpdate() {
		this.cache.forEach(async (val, key) => {
			await fsAsync.writeFile(`${this.cacheDir}${key}.json`, JSON.stringify(val), { encoding: `utf-8` });
		});
	}
}