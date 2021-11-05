import sharp from 'sharp';
import { ImageFormatOptions } from '../types/imageFormatOptions';

export const convertImage = async (
  inputImagePath: string,
  outputImagePath: string,
  options: ImageFormatOptions = {}
) =>
  sharp(inputImagePath)
    .resize({
      fit: options?.resize || 'cover',
      width: options?.width || undefined,
      height: options?.height || undefined,
    })
    .toFile(outputImagePath);
