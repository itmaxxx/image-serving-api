import * as http from 'http';
import { IncomingMessage, ServerResponse } from 'http';
import ImagesController from './controllers/imagesController';
import { sendHttpJsonResponse } from './utils/sendHttpJsonResponse';
import { serveFile } from './utils/serveFile';

const PORT = 3000;

http
  .createServer(function (req: IncomingMessage, res: ServerResponse) {
    const url = req.url;

    console.log(`[${req.method}] ${url}`);

    const imagesController = new ImagesController();

    if (url === '/upload' && req.method === 'POST') {
      return imagesController.uploadImage(req, res);
    } else if (url === '/' && req.method === 'GET') {
      return serveFile('./src/www/index.html', res);
    }

    sendHttpJsonResponse(res, 404, { message: 'Route not found' });
  })
  .listen(PORT);
