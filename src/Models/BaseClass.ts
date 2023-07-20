/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fsSync from 'fs';
//import * as fsAsync from `fs/promises`;

export const Logger = {
	error(err: NodeJS.ErrnoException | any) {
		if (!err) return;
		const now = new Date();
		Logger.write(JSON.stringify(err));
		console.error(`${now.toISOString()} : ${err}`);
	},
	log(msg: string, logToFile?: boolean) {
		const now = new Date();
		console.log(`${now.toISOString()} : ${msg}`);
		if (logToFile) Logger.write(msg);
	},
	write(msg: string) {
		const now = new Date();
		const filename = `logs/${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()} - ${now.getUTCHours()}.log`;
		let logStr = ``;
		if (fsSync.existsSync(filename)) {
			logStr = fsSync.readFileSync(filename, { encoding: `utf-8` });
		}
		logStr += `\n${now.toISOString()} : ${msg}`;
		fsSync.writeFileSync(filename, logStr, { encoding: `utf-8` });
	}
};

export abstract class Base {
	protected readonly APIKey: string;
	protected readonly modelName: ModelOptions;
	protected readonly subModel: GoogleSubModelFamily | GPTSubModelFamily | ClaudeSubModelFamily;
	protected logger = Logger;

	constructor(APIKey: string, model: ModelOptions, submodel: GoogleSubModelFamily | GPTSubModelFamily | ClaudeSubModelFamily) {
		this.APIKey = APIKey;
		this.modelName = model;
		this.subModel = submodel;
		this.logger.log(`ChatHub model loaded: ${model}`);
	}

	abstract sendMessage(text: string, conversation: ConversationMessage[], systemMessage: string): Promise<ChatResponse>

	public getModel() {
		return this.modelName;
	}
}