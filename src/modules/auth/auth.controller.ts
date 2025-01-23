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
import { BaseResponse } from '../../common/base-response';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(
    @Body() regisRequest: RegisRequest,
  ): Promise<BaseResponse<RegisResponse>> {
    try {
      const regisResponse: RegisResponse = await this.authService.register(
        regisRequest.username,
        regisRequest.password,
      );
      return BaseResponse.successResponse(
        'User registered successfully',
        regisResponse,
      );
    } catch (e) {
      if (e instanceof AuthException) {
        throw e;
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/login')
  async login(
    @Body() loginRequest: LoginRequest,
  ): Promise<BaseResponse<LoginResponse>> {
    try {
      const loginResponse: LoginResponse = await this.authService.login(
        loginRequest.username,
        loginRequest.password,
      );
      return BaseResponse.successResponse(
        'User logged in successfully',
        loginResponse,
      );
    } catch (e) {
      if (e instanceof AuthException) {
        throw e;
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
