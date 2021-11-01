import * as http from "http";
import {IncomingMessage, ServerResponse} from "http";
import * as formidable from "formidable";

http.createServer(function(req: IncomingMessage, res: ServerResponse){
	const url = req.url;

	// console.log("User-Agent: " + request.headers["user-agent"]);
	console.log(`[${req.method}] ${url}`);

	if (url === '/upload' && req.method === 'POST') {
		const form = formidable();

		form.parse(req, function(err, fields, files) {
			if (err) {
				throw (err);
			}

			console.log({ fields, files });
			console.log(files.upload[0]);

			res.writeHead(200);
			res.write('received upload');
			res.end();
		});

		return;
	}

	res.writeHead(200, { 'content-type': 'text/html' });
	res.end(
			'<form action="/upload" enctype="multipart/form-data" method="post">'+
			'<input type="text" name="title"><br>'+
			'<input type="file" name="upload" multiple="multiple"><br>'+
			'<input type="submit" value="Upload">'+
			'</form>'
	);
}).listen(3000);