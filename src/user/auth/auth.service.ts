import { ConnectionService } from './../../connection/connection.service';
import { Injectable, ConflictException } from '@nestjs/common';
import { ISignUpBody } from './models/i-auth.model';

@Injectable()
export class AuthService {
  constructor(private readonly connectionService: ConnectionService) { }

  async signup({ email }: ISignUpBody) {
    const existEmail = await this.connectionService.user.findUnique({
      where: { email },
    });

    console.log({ existEmail });
    // if (existEmail) {
    //   throw new ConflictException();
    // }
  }
}
