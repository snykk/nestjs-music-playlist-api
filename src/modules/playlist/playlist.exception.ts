import { HttpException, HttpStatus } from '@nestjs/common';

export class PlaylistException extends HttpException {
  constructor(message: string, http_status: number) {
    super(message, http_status);
  }
}
