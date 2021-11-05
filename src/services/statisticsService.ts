import { StatsModel } from '../models/statsModel';
import { EventType } from '../types/eventTypes';

export default class StatisticsService {
  public static logEvent(type: EventType, imageId: string = null, elapsedTime: number = null) {
    console.log(
      'Event logged: ' +
        type +
        ';' +
        (imageId ? ' imageId: ' + imageId + ';' : '') +
        (elapsedTime ? ' elapsedTime: ' + elapsedTime + 'ms;' : '')
    );
    return StatsModel.create({ type, imageId, elapsedTime });
  }
}
