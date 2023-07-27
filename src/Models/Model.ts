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

export const GoogleModels: GoogleModelFamily[] = [`TextPaLM2`, `ChatPaLM2`];
export const ClaudeModels: ClaudeModelFamily[] = [`Claude-Instant`, `Claude-v2`, `Claude-v1`];
export const GPTModels: GPTModelFamily[] = [`ChatGPT`, `GPT-4`];

export abstract class Model {
	protected readonly APIKey: string;
	protected readonly modelName: ModelOptions;
	protected readonly subModel: GoogleSubModelFamily | GPTSubModelFamily | ClaudeSubModelFamily;
	protected logger = Logger;

	constructor(APIKey: string, model: ModelOptions, subModel: GoogleSubModelFamily | GPTSubModelFamily | ClaudeSubModelFamily) {
		this.APIKey = APIKey;
		this.modelName = model;
		this.subModel = subModel;
		this.logger.log(`ChatHub model loaded: ${model}`);
	}

	abstract sendMessage(conversation: ConversationMessage[]): Promise<ModelResponse>

	public getModel() {
		return this.modelName;
	}
}