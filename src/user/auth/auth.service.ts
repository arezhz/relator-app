import { ConnectionService } from './../../connection/connection.service';
import { Injectable, ConflictException } from '@nestjs/common';
import { ISignUpBody } from './models/i-auth.model';
import * as forge from 'node-forge';
import { UserType } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly connectionService: ConnectionService) { }

  hasedPassword(password: string): string {
    const hashPassword = forge.hmac.create();
    hashPassword.start('sha256', process.env.PASSWORD_KEY);
    hashPassword.update(password);
    return hashPassword.digest().toHex();
  }

  async signup({ email, password, name, phone }: ISignUpBody) {
    const existEmail = await this.connectionService.user.findUnique({
      where: { email },
    });

    if (existEmail) {
      throw new ConflictException();
    }

    const hashedPassword = this.hasedPassword(password);

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
