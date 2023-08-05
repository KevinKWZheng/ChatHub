import * as fsSync from "fs";
import * as fsAsync from "fs/promises";
import fastify from "fastify";
import { Logger } from "../src/Models/Model";

const Server = fastify();

const config: ServerConfig = JSON.parse(fsSync.readFileSync(`config.json`, { encoding: `utf-8` }));

await Server.listen({ port: config.port, host: `0.0.0.0` });