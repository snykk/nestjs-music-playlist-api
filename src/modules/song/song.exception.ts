import { HttpException, HttpStatus } from '@nestjs/common';

export class SongException extends HttpException {
  constructor(message: string, http_status: number) {
    super(message, http_status);
  }
}
