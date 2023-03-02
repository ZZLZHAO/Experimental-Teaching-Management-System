import { Body, Controller, Logger, Post, Request, UseGuards } from "@nestjs/common";
import { CreateUserDto } from "./dto/CreateUserDto";
import { UsersService } from "./users.service";
import { AuthService } from "src/auth/auth.service";
import { Users } from "./users";
import { AuthGuard } from "@nestjs/passport";
import { JwtAuthGuard } from "../../auth/strategy/jwt-auth.guard";
import { UpdateUsersDto } from "./dto/UpdateUsersDto";
import { EnableUserDto } from "./dto/EnableUserDto";
import {UserLoginDto} from './dto/UserLoginDto'
import { MailService } from "src/mail/mail.service";

@Controller("users")
export class UsersController {
  constructor(private userService: UsersService,
    private mailService:MailService
  ) {
  }

  @Post("validateEmail")
  @UseGuards(JwtAuthGuard)
  async validateEmail(@Request() req,@Body() body: { }) {
    let user=req.user;
    let code=Math.random().toString(36).slice(-8);
    this.mailService.sendValidate(user.email,code);
    return code;
  }

  @Post("updatePsw")
  @UseGuards(JwtAuthGuard)
  async vupdatePsw(@Request() req,@Body() body: {password:string}) {
    let user=req.user;
    return this.userService.updatePsw(user,body.password);
  }

  @Post("create")
  async create(@Body() body: CreateUserDto): Promise<Users> {
    Logger.debug(body.jobNumber);
    const user = await this.userService.create(body);
    return user;
  }

  @Post("update")
  @UseGuards(JwtAuthGuard)
  async update(@Request() req, @Body() body: {avatar:string,description:string}): Promise<Users> {
    Logger.debug(body);
    const user = await this.userService.update(req.user.id,body.avatar,body.description);
    return user;
  }

  @Post("userByToken")
  @UseGuards(JwtAuthGuard)
  async getUserByToken(@Request() req) {
    return req.user;
  }
}
