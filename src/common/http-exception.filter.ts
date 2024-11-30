import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseResponse } from './base-response';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    if (exception instanceof BadRequestException) {
      if (Array.isArray(errorResponse['message'])) {
        // supposed it's from validation dto err
        return response
          .status(status)
          .json(validationResponseBuilder(errorResponse['message']));
      } else if (errorResponse['message']) {
        return response
          .status(status)
          .json(BaseResponse.errorResponse('Bad request'));
      }
    }

    if (exception instanceof UnauthorizedException) {
      return response
        .status(status)
        .json(BaseResponse.errorResponse(errorResponse.message));
    }

    response.status(status).json(BaseResponse.errorResponse(errorResponse));
  }
}

function validationResponseBuilder(errResponseMessages: any[]) {
  const groupedErrors = errResponseMessages.reduce((acc, message) => {
    const match = message.match(/^([a-zA-Z0-9_]+)\s*(.*)/);
    if (match) {
      const field = match[1];
      const errorMsg = match[2];

      if (!acc[field]) {
        acc[field] = [];
      }
      acc[field].push(errorMsg);
    } else {
      if (!acc['unknown']) {
        acc['unknown'] = [];
      }
      acc['unknown'].push(message);
    }

    return acc;
  }, {});

  const lastErrors = Object.keys(groupedErrors).map((field) => {
    const messages = groupedErrors[field];
    return {
      field,
      message: messages[messages.length - 1],
    };
  });

  return {
    success: false,
    message: 'Validation failed',
    errors: lastErrors,
  };
}
