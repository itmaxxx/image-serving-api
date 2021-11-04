import sharp from 'sharp';

export const convertImage = async (
  inputImagePath: string,
  outputImagePath: string,
  options: any = {}
) => sharp(inputImagePath, options).toFile(outputImagePath);
