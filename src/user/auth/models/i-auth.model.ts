import { UserType } from '@prisma/client';
export interface ISignUpBody {
  name: string;
  password: string;
  email: string;
  phone: string;
  productKey?: string;
}

export interface ISignInBody {
  password: string;
  email: string;
}

export interface IJwtGenerator {
  id: number;
  email: string;
}
