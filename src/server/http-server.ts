import * as NodeHttp from "http";
import * as NodePath from "path";
import * as NodeFs from "fs";
import * as Mime from "mime-types";
import * as NodeCache from "node-cache";
import {JSDOM} from "jsdom";
import {ServerConfig} from "./types";

/**
 * Simple HTTP server to support SSR.
 */
export class HttpServer {
	protected serverConfig: ServerConfig;

	public constructor(serverConfig: ServerConfig) {
		this.serverConfig = serverConfig;
	}

	public start(): void {
		console.log(`\nServer Side Renderer for edde-js\n\tport:\t\t${this.serverConfig.port}\n\troot:\t\t${this.serverConfig.dist}\n\tcache ttl:\t${this.serverConfig.ttl}\n`);
		const cache = new NodeCache({stdTTL: this.serverConfig.ttl, errorOnMissing: true});
		const referer = `http://edde-js/index.html`;
		console.log('- Starting http server');
		NodeHttp.createServer((request, response) => {
			const file = NodePath.normalize(this.serverConfig.dist + '/' + (request.url === '/' || (request.headers.referer || '') === referer ? 'index.html' : request.url)).replace(/^(\.\.[\/\\])+/, '');
			const path = request.url || '/';
			const cacheId = file;
			try {
				const html = <string>cache.get(cacheId);
				response.writeHead(200, {
					'Content-Type': 'text/html; charset=UTF-8',
					'Content-Length': html.length
				});
				response.end(html);
			} catch (e) {
				NodeFs.access(file, error => {
					if (!error) {
						response.writeHead(200, {
							'Content-Type': Mime.lookup(file) || 'application/octet-stream',
							'Content-Length': NodeFs.statSync(file).size
						});
						NodeFs.createReadStream(file).pipe(response);
						return;
					}
					try {
						JSDOM.fromURL(`http://127.0.0.1:${this.serverConfig.port}${path}`, {
							runScripts: 'dangerously',
							resources: 'usable',
							referrer: referer
						}).then((jsdom: JSDOM) => {
							jsdom.window.addEventListener('load', () => {
								const html = jsdom.serialize();
								cache.set(cacheId, html);
								response.end(html, 'utf-8');
							});
						}).catch((reason: any) => {
							console.error(reason);
						});
					} catch (e) {
						response.writeHead(e === 'error-404' ? 404 : 500);
						response.end();
						console.error(path, e);
					}
				});
			}
		}).listen(this.serverConfig.port);
		console.log(`- We're happily running!\n`);
	}
}
