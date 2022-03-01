import { Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';

@Controller('beaches')
export class BeachesController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    res.status(201).json({ ...req.body, id: 'fake-id'});
  }
}
