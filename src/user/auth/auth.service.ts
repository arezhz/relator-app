import { ConnectionService } from './../../connection/connection.service';
import { Injectable, ConflictException } from '@nestjs/common';
import { ISignUpBody } from './models/i-auth.model';
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

    const token = await jwt.sign(
      {
        id: user.id,
        email,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: 3600000,
      },
    );

    return token;
  }
}
