import { HttpException, HttpStatus } from '@nestjs/common';

export class AIServiceException extends HttpException {
  constructor(message: string = 'Error processing AI request') {
    super(
      {
        error: 'AI Service Error',
        message,
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
      },
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}

