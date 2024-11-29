import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginResponse, RegisResponse } from './auth.dto';
import { AuthException } from './auth.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(username: string, password: string): Promise<RegisResponse> {
    const existingUser = await this.prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      throw new AuthException(
        'Username is already taken',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: { username, passwordHash: hashedPassword },
    });

    return user;
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    const user = await this.prisma.user.findUnique({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Username or password is not valid');
    }

    const payload = { sub: user.id, username: user.username };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
