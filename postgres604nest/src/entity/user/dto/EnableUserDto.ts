import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class EnableUserDto{
  @IsString()
  @IsNotEmpty()

  jobNumber:string
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  @Length(6,28)
  password: string;
}
