import { HttpException, HttpStatus } from '@nestjs/common';

export class ExternalApiException extends HttpException {
  constructor(
    message: string = 'Error communicating with external service',
    serviceName?: string,
  ) {
    super(
      {
        error: 'External Service Error',
        message: serviceName ? `${message}: ${serviceName}` : message,
        statusCode: HttpStatus.BAD_GATEWAY,
      },
      HttpStatus.BAD_GATEWAY,
    );
  }
}

