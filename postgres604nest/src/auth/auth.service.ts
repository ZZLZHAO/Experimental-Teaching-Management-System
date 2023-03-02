import { BadRequestException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { UsersService } from '../entity/user/users.service';
import { JwtService } from '@nestjs/jwt';
import { Debugger } from "inspector";
import { MailService } from "../mail/mail.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService

  ) {}

  async validateUser(emailOrJobNumber: string, pass: string,): Promise<any> {
    Logger.debug(emailOrJobNumber)
    Logger.debug(pass)
    const userEmail = await this.usersService.findByEmail(emailOrJobNumber);
    // Logger.debug(userEmail.password)

    if (userEmail && userEmail.password === pass) {
      const { password, ...result } = userEmail;
      return result;
    }
    const user = await this.usersService.findByJobNumber(emailOrJobNumber);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('用户名或密码错误');

  }

   login(user: any) {
    const payload = { jobNumber: user.jobNumber, sub: user.id };
    Logger.debug(payload)

    return {
      token: this.jwtService.sign(payload),
    };
  }
  async enableUser(jobNumber:string,email:string,password:string) {
    const user=await this.usersService.findByJobNumber(jobNumber);
    if(!user)throw new BadRequestException("用户信息未录入");
    if(user.enabled){
      throw new BadRequestException("用户已经被激活")
    }
    if(user){
      user.enablingEmail=email
      user.enablingPassword=password
      await this.usersService.updateUser(user)
      const token = this.login(user).token
      const info= await this.mailService.sendUserConfirmation(user,email,token)
      Logger.verbose(JSON.stringify(info,null,'\r\n'))
    }
    return user
  }
}
