/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as MRE from "@microsoft/mixed-reality-extension-sdk";
import dotenv from "dotenv";
import { resolve as resolvePath } from "path";
import { App } from "./app";

enum RequestType {
	GET,
	POST,
}

// Read .env if file exists
dotenv.config();

process.on("uncaughtException", (err) => console.log("uncaughtException", err));
process.on("unhandledRejection", (reason) =>
	console.log("unhandledRejection", reason)
);

// MRE.log.enable('network');
// MRE.log.enable('network-content');

// Start listening for connections, and serve static files
const server = new MRE.WebHost({
	// baseUrl: 'http://<ngrok-id>.ngrok.io',
	baseDir: resolvePath(__dirname, "../public"),
	endpoints: [
		{
			type: RequestType.GET,
			url: "/api/hello",
			handler(req, res, next) {
				res.send(200, { hi: "hello" });
				next();
			},
		},
	],
});

// Handle new application sessions
server.adapter.onConnection((context, params) => new App(context, params));

server.ready.then(() => {
	server.adapter.server.get("/test/timeout/:file", (req, res) => {
		console.log("Will time out eventually:", req.url);
		// no res.send
	});
});

export default server;
