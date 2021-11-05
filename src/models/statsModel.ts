import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import { EventType } from '../types/eventTypes'

@modelOptions({
  schemaOptions: { collection: 'stats' },
})
export class StatEvent {
  @prop({ enum: EventType })
  public type: EventType;

  @prop()
  public imageId?: string;

  @prop()
  public elapsedTime?: number;

  @prop({ default: Date.now })
  public date: Date;
}

export const StatsModel = getModelForClass(StatEvent);
