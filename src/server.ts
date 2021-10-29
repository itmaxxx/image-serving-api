import * as http from "http";
import {IncomingMessage, ServerResponse} from "http";

http.createServer(function(req: IncomingMessage, res: ServerResponse){
	const url = req.url;

	// console.log("User-Agent: " + request.headers["user-agent"]);
	console.log(`[${req.method}] ${url}`);

	if (url === '/') {
		res.statusCode = 200;
		res.write('hello world');
	}

	res.end();
}).listen(3000);