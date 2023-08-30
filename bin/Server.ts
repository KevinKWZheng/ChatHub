import fastify from "fastify";
import * as fsSync from "fs";
import { Logger } from "../src/Models/Model";
import { ChatHub, ConversationManager } from "../src/main";

const Server = fastify();
const config: ServerConfig = JSON.parse(fsSync.readFileSync(`.config.json`, { encoding: `utf-8` }));
const Hub = new ChatHub(config.modelConfig, config.cacheDir);
const Conversations = new ConversationManager(true);

Server.post(`/chat`, async (request, reply) => {
	const message = JSON.parse(request.body as string) as ChatHubMessage;
	const timer = setTimeout(() => {
		throw new Error(`Request timed out`);
	}, 2 * 60 * 1000);
	try {
		const response = await Hub.sendMessage(message.text, message.model, message.options);
		clearTimeout(timer);
		if (response.status == `Error`) throw new Error(response.text);
		reply.send({
			status: `Success`,
			text: response.text,
			conversationData: {
				conversationId: response.conversationId,
				model: response.model
			}
		});
	} catch (err) {
		clearTimeout(timer);
		Logger.error(err);
		reply.send({
			status: `Error`,
			text: JSON.stringify(err),
		});
	}
});

Server.get(`/conversations`, async (request, reply) => {
	const response: {
		deleted?: string[],
		imported?: string[],
		exported?: Conversation
	} = {};

	if (request.headers.del) {
		const conversationIds = request.headers.del as string[];
		const deleted: string[] = [];
		for (const i in conversationIds) {
			const result = await Conversations.del(conversationIds[i]);
			if (result) deleted.push(result);
		}
		response.deleted = deleted;
	}

	if (request.headers.import) {
		const conversations: Conversation[] = JSON.parse(JSON.stringify(request.headers.import)) as Conversation[];
		const imported: string[] = [];
		for (const i in conversations) {
			try {
				await Conversations.import(conversations[i]);
				imported.push(conversations[i].id);
			} catch (err) {
				continue;
			}
		}
		response.imported = imported;
	}

	if (request.headers.export) {
		const conversationId = request.headers.export as string;
		const conversation = await Conversations.get(conversationId);
		response.exported = conversation;
	}

	reply.send(response);
});

Server.get(`/models`, async (request, reply) => {
	if (request.headers.type == `list`) {
		const list = Hub.getAllModels();
		reply.send(list);
	}
});

await Server.listen({ port: config.port, host: `0.0.0.0` });

Server.ready((err) => {
	if (err) {
		Logger.error(err);
		process.exit();
	}
	Logger.log(`Server launched`);
});