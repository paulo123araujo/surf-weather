import './util/module-alias';
import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import { ForecastController } from '@src/controllers/forecast-controller';
import { Application } from 'express';
import * as database from '@src/database';
import { BeachesController } from '@src/controllers/beaches-controller';
import { UsersController } from '@src/controllers/users-controller';

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public getApp(): Application {
    return this.app;
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.databaseSetup();
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();
    const beachesController = new BeachesController();
    const usersController = new UsersController()
    this.addControllers([forecastController, beachesController, usersController]);
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  public start(): void {
    this.app.listen(this.port, () => console.info(`Server listening on port: ${this.port}`));
  }

  public async close(): Promise<void> {
    await database.close();
  }
}
