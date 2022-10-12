import { ConnectionService } from './../../connection/connection.service';
import { Injectable, ConflictException, HttpException } from '@nestjs/common';
import { IJwtGenerator, ISignInBody, ISignUpBody } from './models/i-auth.model';
import { UserType } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { createHmac } from 'node:crypto';

@Injectable()
export class AuthService {
  constructor(private readonly connectionService: ConnectionService) { }

  hasedPassword(password: string): string {
    const hashPassword = createHmac('sha256', process.env.PASSWORD_KEY)
      .update(password)
      .digest('hex');
    return hashPassword;
  }

  jwtGenerator({ id, email }: IJwtGenerator): string {
    return jwt.sign(
      {
        id,
        email,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: 3600000,
      },
    );
  }

  async signup({ email, password, name, phone }: ISignUpBody) {
    const existEmail = await this.connectionService.user.findUnique({
      where: { email },
    });

    if (existEmail) {
      throw new ConflictException();
    }

    const hashedPassword = await this.hasedPassword(password);

    const user = await this.connectionService.user.create({
      data: {
        email,
        name,
        phone,
        password: hashedPassword,
        user_type: UserType.BUYER,
      },
    });

    const jwtBody: IJwtGenerator = {
      id: user.id,
      email,
    };
    const token = await this.jwtGenerator(jwtBody);

    return token;
  }

  async signin({ email, password }: ISignInBody) {
    const user = await this.connectionService.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new HttpException('The email or Password is wrong!', 400);
    }
    const hashedPassword = await this.hasedPassword(password);
    const correctPassword = !!(user.password === hashedPassword);

    if (!correctPassword) {
      throw new HttpException('The email or Password is wrong!', 400);
    }
    const jwtBody: IJwtGenerator = {
      id: user.id,
      email,
    };

    const token = await this.jwtGenerator(jwtBody);

    return token;
  }
}
