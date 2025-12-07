import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  constructor(message: string = 'Invalid data', errors?: string[]) {
    super(
      {
        error: 'Validation Error',
        message,
        errors: errors || [],
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

