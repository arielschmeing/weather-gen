import { Injectable } from '@nestjs/common';

export interface HelloWorld {
  api: string;
}

@Injectable()
export class AppService {
  getHello(): HelloWorld {
    return {
      api: 'ok',
    };
  }
}
