import { IncomingMessage, ServerResponse } from 'http';
import { sendHttpJsonResponse } from '../utils/sendHttpJsonResponse';
import StatisticsService from '../services/statisticsService';
import { EventType } from '../types/eventTypes';

export default class StatisticsController {
  public static GET_STATS_WITH_TYPE_AND_DATE =
    /^\/stats\/(image_uploaded|image_deleted|image_converted|image_served)\/([0-9]{1,10})$/;

  statisticsService = new StatisticsService();

  public async getStatisticsForTypeAndDate(req: IncomingMessage, res: ServerResponse) {
    try {
      const decomposedUrl = req.url.match(StatisticsController.GET_STATS_WITH_TYPE_AND_DATE);
      const eventType = decomposedUrl[1];
      const minutes = parseInt(decomposedUrl[2]);

      const stats = await this.statisticsService.getEventsAfterDate(
        new Date(Date.now() - minutes * 60 * 1000),
        eventType.toUpperCase() as EventType
      );

      const countForLast24Hours = (data) => {
        const arrayOfHours = data.map((s) => new Date(s.date).getHours());
        const result = {};

        for (let i = 0; i < 24; i++) {
          result[i] = 0;
        }

        arrayOfHours.forEach((h) => result[h - 1]++);

        return result;
      };

      const elapsedTimeForLast24Hours = (data) => {
        const arrayOfHours = data.map(s => ({ hour: new Date(s.date).getHours(), elapsedTime: s.elapsedTime }));
        const result = {};

        for (let i = 0; i < 24; i++) {
          result[i] = 0;
        }

        arrayOfHours.forEach(h => result[h.hour - 1] += h.elapsedTime);

        return result;
      }

      const averageElapsedTimeForLast24Hours = (data) => {
        const elapsedTime = elapsedTimeForLast24Hours(data);

        const arrayOfHours = data.map(s => ({ hour: new Date(s.date).getHours(), elapsedTime: s.elapsedTime }));
        const result = {};

        for (let i = 0; i < 24; i++) {
          result[i] = 0;
        }

        arrayOfHours.forEach(h => result[h.hour - 1]++);

        for (let i = 0; i < 24; i++) {
          result[i] = elapsedTime[i] / (result[i] || 1);
        }

        return result;
      }

      const queriesCount = countForLast24Hours(stats);
      const averageResponseTime = averageElapsedTimeForLast24Hours(stats);

      await sendHttpJsonResponse(res, 200, {
        data: { queriesCount, averageResponseTime },
      });
    } catch (error) {
      console.log(error);
      sendHttpJsonResponse(res, 500, {
        message: 'Failed to get statistics',
      });
    }
  }
}
