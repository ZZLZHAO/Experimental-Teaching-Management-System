import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthConstants } from "./constants";
import { UsersService } from "../../entity/user/users.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService:UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: AuthConstants.JWT_SECRET,
    });
    this.userService=userService;
  }

  async validate(payload: {sub:string, jobNumber:string }) {
    //db lookup
    // Logger.debug(`'sub(id)':${payload.sub}`)
    Logger.debug(`email(tel)':${payload.jobNumber}`)
    const user = await this.userService.findByJobNumber(payload.jobNumber)

    Logger.debug(user)
    // Logger.debug(payload)
    if (user && user.id.toString() === payload.sub.toString()) {
      Logger.debug('test');
      user.enabled=true;
      user.email=user.enablingEmail
      user.password=user.enablingPassword;
      return await this.userService.updateUser(user);
    }
    throw new HttpException('未找到token对应的用户',HttpStatus.UNAUTHORIZED);
  }
}
