import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginRequest,
  LoginResponse,
  RegisRequest,
  RegisResponse,
} from './auth.dto';
import { AuthException } from './auth.exception';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() regisRequest: RegisRequest) {
    try {
      const regisResponse: RegisResponse = await this.authService.register(
        regisRequest.username,
        regisRequest.password,
      );
      return {
        success: true,
        data: regisResponse,
      };
    } catch (e) {
      if (e instanceof AuthException) {
        throw new HttpException(e.message, e.getStatus());
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/login')
  async login(@Body() loginRequest: LoginRequest) {
    try {
      const loginResponse: LoginResponse = await this.authService.login(
        loginRequest.username,
        loginRequest.password,
      );
      return {
        success: true,
        data: loginResponse,
      };
    } catch (e) {
      if (e instanceof AuthException) {
        throw new HttpException(e.message, e.getStatus());
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
