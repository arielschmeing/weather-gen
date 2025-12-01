import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenUserException extends HttpException {
  constructor() {
    super(
      {
        error: 'Forbidden',
        message: 'User does not exist.',
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
