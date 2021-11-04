import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import { Types } from 'mongoose'
import { EventType } from '../types/eventTypes'

@modelOptions({
  schemaOptions: { collection: 'stats' },
})
export class StatEvent {
  @prop({ enum: EventType })
  public type: EventType;

  @prop({ default: null })
  public payload?: string;

  @prop({ default: Date.now })
  public date: Date;
}

export const StatsModel = getModelForClass(StatEvent);
