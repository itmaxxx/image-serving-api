import fs from 'fs';
import http from 'http';
import path from 'path';
import { cpus } from 'os';
import dotenv from 'dotenv';
import cluster from 'cluster';
import mongoose from 'mongoose';
import { copyFile } from 'fs/promises';
import { serveFile } from './utils/serveFile';
import { IncomingMessage, ServerResponse } from 'http';
import { ImageClass, ImageModel } from './models/imageModel';
import ImagesController from './controllers/imagesController';
import { sendHttpJsonResponse } from './utils/sendHttpJsonResponse';
import StatisticsController from './controllers/statisticsController';

dotenv.config();
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, API_PORT } = process.env;

const PORT = API_PORT || 3000;

connectMongoDb()
  .catch((err) => console.error(err))
  .then(setupAutoUploadImages);

async function connectMongoDb() {
  await mongoose.connect(
    `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`
  );

  console.log('MongoDB connected');

  if (!process.env.SECRET_KEY) {
    console.warn(
      'Service started without SECRET_KEY in .env, it means that anyone can upload/delete images'
    );
  }
}

function setupAutoUploadImages() {
  const autoLoadFolderPath = __dirname + '/www/uploads/autoUpload';

  fs.readdir(autoLoadFolderPath, async (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    for (const file of files) {
      try {
        const fileExtension = file.slice(file.lastIndexOf('.') + 1, file.length).toLowerCase();

        if (['jpg', 'jpeg', 'webp', 'png'].indexOf(fileExtension) === -1) {
          console.error(`Fixtures: ${file} has unsupported file extension`);
          continue;
        }

        const imageId = file.slice(0, 24);
        const uploadFolderPath = ImagesController.IMAGES_PATH + file;

        await copyFile(path.join(autoLoadFolderPath, file), uploadFolderPath);

        const imageFromDb: ImageClass = await ImageModel.findById(imageId);

        if (imageFromDb?.deleted) {
          await ImageModel.deleteOne({ _id: imageId });

          console.log(`Fixtures: ${file} was deleted from db`);
        }

        if (!imageFromDb) {
          await ImageModel.create({
            _id: imageId,
            originalExtension: fileExtension,
          });

          console.log(`Fixtures: ${file} was initialized`);

          continue;
        }

        console.log(`Fixtures: ${file} image was moved to uploads`);
      } catch (error) {
        console.error(`Fixtures: failed to load fixture file: ${file}`, error);
      }
    }
  });
}

if (cluster.isPrimary) {
  console.log(`Primary process ${process.pid} is running`);

  for (let i = 0; i < cpus().length; i++) {
    cluster.fork();
  }

  cluster.on('exit', () => {
    console.log(`Worker process ${process.pid} died`);
    cluster.fork();
  });
} else {
  console.log(`Worker process ${process.pid} is running`);

  http
    .createServer(function (req: IncomingMessage, res: ServerResponse) {
      const url = req.url;

      console.log(`[${req.method}] ${url}`);

      const imagesController = new ImagesController();
      const statisticsController = new StatisticsController();

      if (url.match(ImagesController.IMAGE_URL_PATTERN) && req.method === 'GET') {
        return imagesController.serveImage(req, res);
      } else if (
        url.match(ImagesController.IMAGE_WITH_OPTIONS_URL_PATTERN) &&
        req.method === 'GET'
      ) {
        return imagesController.serveImageWithOptions(req, res);
      } else if (url.match(ImagesController.DELETE_IMAGE_URL_PATTERN) && req.method === 'DELETE') {
        return imagesController.deleteImage(req, res);
      } else if (
        url.match(StatisticsController.GET_STATS_WITH_TYPE_AND_DATE) &&
        req.method === 'GET'
      ) {
        return statisticsController.getStatisticsForTypeAndDate(req, res);
      } else if (url === '/upload' && req.method === 'POST') {
        return imagesController.uploadImage(req, res);
      } else if (url === '/statistics' && req.method === 'GET') {
        return serveFile('./src/www/statistics.html', res);
      } else if (url === '/' && req.method === 'GET') {
        return serveFile('./src/www/index.html', res);
      }

      sendHttpJsonResponse(res, 404, { message: 'Route not found' });
    })
    .listen(PORT);
}
