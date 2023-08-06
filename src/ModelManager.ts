import { Claude, isClaudeModel } from "./Models/Anthropic";
import { PaLM, isGoogleModel } from "./Models/Google";
import { OpenAI, isGPTModel } from "./Models/OpenAI";

type ModelClass = Claude | PaLM | OpenAI;

export class ModelManager {
	protected models: Map<ModelOptions, ModelClass>;

	constructor(config: ModelConfig[]) {
		this.models = new Map();
		for (const i in config) {
			if (isGPTModel(config[i].model))
				this.models.set(config[i].model,
					new OpenAI(config[i].APIKey, config[i].model as GPTModelFamily));
			else if (isClaudeModel(config[i].model))
				this.models.set(config[i].model,
					new Claude(config[i].APIKey, config[i].model as ClaudeModelFamily));
			else if (isGoogleModel(config[i].model))
				this.models.set(config[i].model,
					new PaLM(config[i].APIKey, config[i].model as GoogleModelFamily));
			else throw new TypeError(`Unknown model: ${config[i].model}`);
		}
	}

	public hasModel(model: ModelOptions) {
		return this.models.has(model);
	}

	public listModels() {
		return this.models.keys();
	}

	public addModels(config: ModelConfig[]) {
		for (const i in config) {
			if (isGPTModel(config[i].model))
				this.models.set(config[i].model,
					new OpenAI(config[i].APIKey, config[i].model as GPTModelFamily));
			else if (isClaudeModel(config[i].model))
				this.models.set(config[i].model,
					new Claude(config[i].APIKey, config[i].model as ClaudeModelFamily));
			else if (isGoogleModel(config[i].model))
				this.models.set(config[i].model,
					new PaLM(config[i].APIKey, config[i].model as GoogleModelFamily));
			else throw new TypeError(`Unknown model: ${config[i].model}`);
		}
		return this.listModels();
	}
	public deleteModel(modelName: ModelOptions) {
		if (this.models.has(modelName))
			this.models.delete(modelName);
	}

	protected getModel(modelName: ModelOptions) {
		if (!this.hasModel(modelName))
			throw new Error(`Unavailable model: ${modelName}`);
		else
			return this.models.get(modelName);
	}

	public async sendMessage(conversation: ConversationMessage[], modelName: ModelOptions) {
		const model = this.getModel(modelName) as ModelClass;
		return await model.sendMessage(conversation);
	}

	public async genText(prompt: string) {
		const model = this.models.get(`TextPaLM2`) as PaLM;
		return await model.genText(prompt);
	}
}