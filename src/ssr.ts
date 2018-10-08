#!/usr/bin/env node
import * as Minimist from "minimist";
import {HttpServer, ServerConfig} from "./server";

new HttpServer(<any>Minimist(process.argv, {
	default: <ServerConfig>{
		port: 80,
		ttl: 60,
		dist: process.cwd() + '/public'
	}
})).start();
