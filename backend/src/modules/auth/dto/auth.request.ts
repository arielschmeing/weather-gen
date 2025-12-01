import { Request } from 'express';
import { Payload } from '../interfaces/payload.interface';

export interface AuthRequest extends Request {
  user: Payload;
}
