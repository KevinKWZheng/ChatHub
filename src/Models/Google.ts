import { GoogleAuth } from 'google-auth-library';
import { TextServiceClient, DiscussServiceClient } from "@google-ai/generativelanguage";
import { Base } from './BaseClass';

const GoogleSubModels = [`models/chat-bison-001`, `models/text-bison-001`]

export class PaLM extends Base{
	constructor(APIKey:string,model:string,submodel:string){
		super()
	}
}