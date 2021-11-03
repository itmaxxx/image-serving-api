import { getModelForClass, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

class Image {
  @prop()
  public _id: Types.ObjectId;

  @prop()
  public deleted: boolean;
}

export const ImageModel = getModelForClass(Image);
