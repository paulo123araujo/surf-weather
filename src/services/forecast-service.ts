import { StormGlassClient, ForecastPoint } from '@src/clients';
import { InternalError } from '@src/util/errors/internal-error';
import { Beach } from '@src/models/beach';

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}

export interface TimeForecast {
  time: string;
  forecast: BeachForecast[];
}

export class ForecastProcessingInternalError extends InternalError {
  constructor(message: string) {
    super(`Unexpected error during the forecast processing: ${message}`);
  }
}

export class ForecastService {
  constructor(
    private readonly stormGlassClient: StormGlassClient = new StormGlassClient(),
  ) {}

  public async processForecastForBeaches(
    beaches: Beach[],
  ): Promise<TimeForecast[]> {
    const pointsWithCorrectSources: BeachForecast[] = [];

    try {
      for (const beach of beaches) {
        const points = await this.stormGlassClient.fetchPoints(
          beach.lat,
          beach.lng,
        );
        const enrichBeachData = this.enrichedBeachData(points, beach);

        pointsWithCorrectSources.push(...enrichBeachData);
      }
    } catch (error) {
      throw new ForecastProcessingInternalError((error as Error).message);
    }

    return this.mapForecastByTime(pointsWithCorrectSources);
  }

  private enrichedBeachData(
    points: ForecastPoint[],
    beach: Beach,
  ): BeachForecast[] {
    return points.map((point) => ({
      ...{
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: 1,
      },
      ...point,
    }));
  }

  private mapForecastByTime(forecast: BeachForecast[]): TimeForecast[] {
    const forecastByTime: TimeForecast[] = [];

    for (const point of forecast) {
      const timePoint = forecastByTime.find((f) => f.time === point.time);
      if (timePoint) {
        timePoint.forecast.push(point);
        continue;
      }

      forecastByTime.push({
        time: point.time,
        forecast: [point],
      });
    }

    return forecastByTime;
  }
}
