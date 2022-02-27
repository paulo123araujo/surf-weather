import { StormGlassClient, ForecastPoint } from '@src/clients';

export enum BeachPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N'
}

export interface Beach {
  name: string;
  position: BeachPosition;
  lat: number;
  lng: number;
  user: string;
}

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}

export interface TimeForecast {
  time: string;
  forecast: BeachForecast[];
}

export class ForecastService {
  constructor(
    private readonly stormGlassClient: StormGlassClient = new StormGlassClient()
  ) {}

  public async processForecastForBeaches(beaches: Beach[]): Promise<TimeForecast[]> {
    const pointsWithCorrectSources: BeachForecast[] = [];
    
    for(const beach of beaches) {
      const points = await this.stormGlassClient.fetchPoints(beach.lat, beach.lng);
      const enrichBeachData = points.map((point) => ({
        ...{
          lat: beach.lat,
          lng: beach.lng,
          name: beach.name,
          position: beach.position,
          rating: 1
        },
        ...point
      }));

      pointsWithCorrectSources.push(...enrichBeachData);
    }

    return this.mapForecastByTime(pointsWithCorrectSources);
  }

  private mapForecastByTime(forecast: BeachForecast[]): TimeForecast[] {
    const forecastByTime: TimeForecast[] = [];

    for(const point of forecast) {
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