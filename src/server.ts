import * as http from "http";
import {IncomingMessage, ServerResponse} from "http";
import * as formidable from "formidable";
import {sendHttpJsonResponse} from "./utils/sendHttpJsonResponse";
import * as fs from "fs";

const PORT = 3000;

http.createServer(function(req: IncomingMessage, res: ServerResponse){
	const url = req.url;

	console.log(`[${req.method}] ${url}`);

	if (url === '/upload' && req.method === 'POST') {
		try {
			const form = new formidable.IncomingForm();

			form.parse(req, function(err, fields, files) {
				if (err) {
					throw (err);
				}

				const file: any = (files.upload as any)?.length ? files.upload[0] : files.upload;

				if (!file) {
					throw ({ message: 'File not passed' })
				}

				fs.rename(file._writeStream.path, './src/www/public/uploads/original/' + file.originalFilename, function (err) { throw err; });

				sendHttpJsonResponse(res, 200, { message: "Your file uploaded" })
			});

			return;
		} catch (error: any) {
			sendHttpJsonResponse(res, 500, { message: error.message || "Failed to upload file" })
		}
	}

	res.writeHead(200, { 'content-type': 'text/html' });
	res.end(
			'<form action="/upload" enctype="multipart/form-data" method="post">'+
			'<input type="text" name="title"><br>'+
			'<input type="file" name="upload" multiple="multiple"><br>'+
			'<input type="submit" value="Upload">'+
			'</form>'
	);
}).listen(PORT);