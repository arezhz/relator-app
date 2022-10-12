export interface ISignUpBody {
  name: string;
  password: string;
  email: string;
  phone: string;
}

export interface ISignInBody {
  password: string;
  email: string;
}

export interface IJwtGenerator {
  id: number;
  email: string;
}
