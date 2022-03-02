import { Controller, Get } from '@overnightjs/core';
import { Beach } from '@src/models/beach';
import { ForecastService } from '@src/services/forecast-service';
import { Request, Response } from 'express';
@Controller('forecast')
export class ForecastController {
  constructor(
    private readonly service: ForecastService = new ForecastService(),
  ) {}

  @Get('')
  public async getForecastForLoggedUser(
    _: Request,
    res: Response,
  ): Promise<void> {
    try {
      const beaches = await Beach.find({});
      const forecastData = await this.service.processForecastForBeaches(
        beaches,
      );
      res.status(200).json(forecastData);
    } catch (err) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
}
