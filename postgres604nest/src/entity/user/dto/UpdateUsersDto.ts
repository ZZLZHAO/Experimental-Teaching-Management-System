import { IsBoolean, IsNotEmpty, IsNumber, IsString, Length } from "class-validator";
import { Column } from "typeorm";

export class UpdateUsersDto{
  @IsString()
  email: string;//email
  @IsString()
  subject: string;
  @IsString()
  description: string;
  @IsNotEmpty()
  @Length(6,28)
  password: string;//密码

  @IsString()
 avatar: string;
  @IsNumber()
 grade: number;
 @IsBoolean()
  enabled: boolean;
}
