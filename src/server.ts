import * as http from 'http';
import { IncomingMessage, ServerResponse } from 'http';
import ImagesController from './controllers/imagesController';
import { sendHttpJsonResponse } from './utils/sendHttpJsonResponse';
import { serveFile } from './utils/serveFile';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, NODE_LOCAL_PORT } =
  process.env;

const PORT = NODE_LOCAL_PORT || 3000;

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(
    `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`
  );

  console.log('MongoDB connected');
}

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
