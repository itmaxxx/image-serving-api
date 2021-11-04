import { StatsModel } from '../models/statsModel';
import { EventType } from '../types/eventTypes';

export default class StatisticsService {
  public static logEvent(type: EventType, payload: string = null) {
    console.log('Event logged: ' + type + ';' + (payload ? ' payload: ' + payload + ';' : ''));
    return StatsModel.create({ type, payload });
  }
}
