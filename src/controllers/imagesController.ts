import fs from 'fs';
import { Types } from 'mongoose';
import formidable from 'formidable';
import { IncomingMessage, ServerResponse } from 'http';
import { ImageClass, ImageModel } from '../models/imageModel';
import StatisticsService from '../services/statisticsService';
import { EventType } from '../types/eventTypes';
import { moveFile } from '../utils/moveFile';
import { serveFile } from '../utils/serveFile';
import { convertImage } from '../utils/convertImage';
import { sendHttpJsonResponse } from '../utils/sendHttpJsonResponse';
import { parseImageFormatOptions } from '../utils/parseImageFormatOptions';
import { ImageFormatOptions } from '../types/imageFormatOptions';
import { optionsToString } from '../utils/optionsToString';
import { checkIfAuthorized } from '../utils/checkIfAuthorized';

export default class ImagesController {
  public static IMAGE_URL_PATTERN = /^\/uploads\/([0-9A-z]{24})\.(jpg|jpeg|png|webp)$/;
  public static IMAGE_WITH_OPTIONS_URL_PATTERN =
    /^\/uploads\/(.+)\/([0-9A-z]{24})\.(jpg|jpeg|png|webp)$/;
  public static DELETE_IMAGE_URL_PATTERN = /^\/uploads\/([0-9A-z]{24})$/;
  public static IMAGES_PATH = './src/www/uploads/';

  public async uploadImage(req: IncomingMessage, res: ServerResponse) {
    try {
      const hrstart = process.hrtime();
      const form = new formidable.IncomingForm();

      const parsedForm: any = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) return reject(err);

          resolve({ fields, files });
        });
      });

      const fields = parsedForm.fields;
      const files = parsedForm.files;

      checkIfAuthorized(fields);

      const file: any = (files.upload as any)?.length ? files.image[0] : files.image;

      if (!file) {
        return sendHttpJsonResponse(res, 403, { message: 'File not passed' });
      }

      if (['image/jpg', 'image/jpeg', 'image/webp', 'image/png'].indexOf(file.mimetype) === -1) {
        return sendHttpJsonResponse(res, 403, {
          message: 'File mime type not supported',
        });
      }

      const fileExtension = file.originalFilename.slice(
        file.originalFilename.lastIndexOf('.') + 1,
        file.originalFilename.length
      );

      if (['jpg', 'jpeg', 'webp', 'png'].indexOf(fileExtension) === -1) {
        return sendHttpJsonResponse(res, 403, {
          message: 'File extension not supported',
        });
      }

      const imageId = new Types.ObjectId();
      const imageName = imageId + '.' + fileExtension;
      const oldPath = file._writeStream.path;
      const newPath = ImagesController.IMAGES_PATH + imageName;

      moveFile(oldPath, newPath);

      await ImageModel.create({
        _id: imageId,
        originalExtension: fileExtension,
      });

      const hrend = process.hrtime(hrstart);
      StatisticsService.logEvent(EventType.ImageUploaded, imageId.toString(), hrend[1] / 1000000);

      await sendHttpJsonResponse(res, 200, {
        message: 'Image uploaded',
        imageId,
        link: `${process.env.API_URL}/uploads/${imageName}`,
      });
    } catch (error) {
      console.log(error);
      sendHttpJsonResponse(res, 500, {
        message: 'Failed to upload image',
      });
    }
  }

  private async convertImageAndServe(
    res: ServerResponse,
    imageId: Types.ObjectId,
    imageExtension: string,
    options: ImageFormatOptions = {}
  ) {
    const hrstart = process.hrtime();

    const imageFromDb: ImageClass = await ImageModel.findById(imageId);

    if (!imageFromDb || imageFromDb.deleted) {
      return sendHttpJsonResponse(res, 404, {
        message: 'Image not found or deleted',
      });
    }

    const requestedImagePath =
      ImagesController.IMAGES_PATH + imageId + optionsToString(options) + '.' + imageExtension;

    if (!fs.existsSync(requestedImagePath)) {
      const originalImagePath =
        ImagesController.IMAGES_PATH + imageId + '.' + imageFromDb.originalExtension;

      await convertImage(originalImagePath, requestedImagePath, options);

      const hrend = process.hrtime(hrstart);
      StatisticsService.logEvent(EventType.ImageConverted, imageId.toString(), hrend[1] / 1000000);
    }

    const hrend = process.hrtime(hrstart);
    StatisticsService.logEvent(EventType.ImageServed, imageId.toString(), hrend[1] / 1000000);

    return await serveFile(requestedImagePath, res);
  }

  public async serveImage(req: IncomingMessage, res: ServerResponse) {
    try {
      const decomposedUrl = req.url.match(ImagesController.IMAGE_URL_PATTERN);
      const imageId = decomposedUrl[1];
      const imageExtension = decomposedUrl[2];

      await this.convertImageAndServe(res, new Types.ObjectId(imageId), imageExtension);
    } catch (error) {
      console.log(error);
      return sendHttpJsonResponse(res, 404, {
        message: 'Failed to serve image',
      });
    }
  }

  public async serveImageWithOptions(req: IncomingMessage, res: ServerResponse) {
    try {
      const decomposedUrl = req.url.match(ImagesController.IMAGE_WITH_OPTIONS_URL_PATTERN);
      const options = parseImageFormatOptions(decomposedUrl[1]);
      const imageId = decomposedUrl[2];
      const imageExtension = decomposedUrl[3];

      await this.convertImageAndServe(res, new Types.ObjectId(imageId), imageExtension, options);
    } catch (error) {
      console.log(error);
      return sendHttpJsonResponse(res, 404, {
        message: 'Failed to serve image',
      });
    }
  }

  public async deleteImage(req: IncomingMessage, res: ServerResponse) {
    try {
      const hrstart = process.hrtime();
      const form = new formidable.IncomingForm();

      const parsedForm: any = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) return reject(err);

          resolve({ fields, files });
        });
      });

      const fields = parsedForm.fields;

      checkIfAuthorized(fields);

      const decomposedUrl = req.url.match(ImagesController.DELETE_IMAGE_URL_PATTERN);
      const imageId = decomposedUrl[1];

      await ImageModel.findOneAndUpdate({ _id: imageId }, { deleted: true });

      const hrend = process.hrtime(hrstart);
      StatisticsService.logEvent(EventType.ImageDeleted, imageId.toString(), hrend[1] / 1000000);

      return sendHttpJsonResponse(res, 200, {
        message: 'Image deleted',
      });
    } catch (error) {
      console.log(error);
      return sendHttpJsonResponse(res, 403, {
        message: 'Failed to delete image',
      });
    }
  }
}
