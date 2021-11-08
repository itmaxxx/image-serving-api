import sharp from 'sharp';
import { ImageFormatOptions } from '../types/imageFormatOptions';
import { ImageExtension } from '../types/imageExtension';
import imageExtensionToSharpFieldName from './imageExtensionToSharpFieldName';

export const convertImageAndSaveToFile = async (
  inputImagePath: string,
  outputImagePath: string,
  outputImageExtension: ImageExtension,
  options: ImageFormatOptions = {}
) => {
  return await sharp(inputImagePath)
    [imageExtensionToSharpFieldName(outputImageExtension)]({
      quality: options?.quality || outputImageExtension === ImageExtension.PNG ? 100 : 80,
    })
    .resize({
      fit: options?.resize || 'cover',
      width: options?.width || undefined,
      height: options?.height || undefined,
    })
    .toFile(outputImagePath);
};
