import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

@modelOptions({
  schemaOptions: { collection: 'images' },
})
export class ImageClass {
  @prop()
  public _id: Types.ObjectId;

  @prop()
  public originalExtension: string;

  @prop({ default: null })
  public deleted: boolean;
}

export const ImageModel = getModelForClass(ImageClass);
