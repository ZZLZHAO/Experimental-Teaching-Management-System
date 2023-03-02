import { IsEmail, IsNotEmpty, isString, IsString, Length } from "class-validator";

export class UserLoginDto{
  @IsNotEmpty()
  @IsString()
  emailOrJobNumber: string;
  @IsNotEmpty()
  @IsString()
  @Length(6,28)
  password: string;
}
