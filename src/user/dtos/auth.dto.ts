import {
  IsString,
  IsEmail,
  Matches,
  MinLength,
  IsNotEmpty,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Matches(
    /^09(0[0-5]|1[0-9]|3[0-9]|2[0-3]|4[1]|9[0-9])-?[0-9]{3}-?[0-9]{4}|^9(0[0-5]|1[0-9]|3[0-9]|2[0-3]|4[1]|9[0-9])-?[0-9]{3}-?[0-9]{4}$/,
    {
      message: ' تلفن همراه معتبر نمی باشد.',
    },
  )
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
