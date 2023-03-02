import { IsEmail, IsNotEmpty, isString, IsString, Length } from "class-validator";

export class CreateUserDto{
  @IsNotEmpty()
  @IsString()
  jobNumber: string;
  @IsNotEmpty()
  @IsString()
  realName:string;
}
