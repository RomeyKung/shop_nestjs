import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { Response } from 'express';
import * as ms from 'ms';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async verifyUser(email: string, password: string) {
    try {
      const user = await this.userService.getUserByFilter({ email });
      const authenticated = await bcrypt.compare(password, user.password);
      if (!authenticated) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
  }
  async login(user: User, response: Response) {
    const expires = new Date();
    const jwtExpiration =
      this.configService.getOrThrow<string>('JWT_EXPIRATION');

    expires.setMilliseconds(
      expires.getMilliseconds() +
        ms(jwtExpiration as unknown as ms.StringValue),
    );
    const tokenPayload: TokenPayload = {
      userId: user.id,
    };
    const token = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', token, {
      secure: true,
      httpOnly: true,
      expires,
    });

    return { tokenPayload };
  }

  async logout(response: Response) {
    response.clearCookie('Authentication', {
      secure: true,
      httpOnly: true,
    });
  }

  async verifyToken(jwt: string) {
    this.jwtService.verify(jwt);
  }
}
