import { ProductKeyDto } from './../dtos/auth.dto';
import { ConnectionService } from './../../connection/connection.service';
import { Injectable, ConflictException, HttpException } from '@nestjs/common';
import { IJwtGenerator, ISignInBody, ISignUpBody } from './models/i-auth.model';
import { User, UserType } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { createHmac } from 'node:crypto';
import { UnauthorizedException } from '@nestjs/common/exceptions';

@Injectable()
export class AuthService {
  constructor(private readonly connectionService: ConnectionService) { }

  hasedHandler(password: string, secretKey: string): string {
    const hashResult = createHmac('sha256', secretKey)
      .update(password)
      .digest('hex');
    return hashResult;
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

  async signup(
    { email, password, name, phone, productKey }: ISignUpBody,
    userType: UserType,
  ) {
    if (userType !== UserType.BUYER) {
      if (!productKey) {
        throw new UnauthorizedException();
      }

      const productKeyString = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
      const hashKey = await this.hasedHandler(
        productKeyString,
        process.env.PRODUCT_KEY_SECRET,
      );

      if (hashKey !== productKey) {
        throw new UnauthorizedException();
      }
    }

    const existEmail = await this.connectionService.user.findUnique({
      where: { email },
    });

    if (existEmail) {
      throw new ConflictException();
    }

    const hashedPassword = await this.hasedHandler(
      password,
      process.env.PASSWORD_KEY,
    );

    const user = await this.connectionService.user.create({
      data: {
        email,
        name,
        phone,
        password: hashedPassword,
        user_type: userType,
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
    const hashedPassword = await this.hasedHandler(
      password,
      process.env.PASSWORD_KEY,
    );
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

  async generateProductKey(email: string, userType: UserType) {
    const productKeyString = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
    const hashKey = await this.hasedHandler(
      productKeyString,
      process.env.PRODUCT_KEY_SECRET,
    );
    return hashKey;
  }
}
