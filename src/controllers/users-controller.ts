import { Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { User } from '@src/models/user';
import mongoose from 'mongoose';

@Controller('users')
export class UsersController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const user = new User(req.body);
      const result = await user.save();

      res.status(201).json(result);
    } catch (err) {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(422).json({ error: err.message });
      } else {
        res.status(500).send({ error: 'Internal Server Error' });
      }
    }
  }
}
