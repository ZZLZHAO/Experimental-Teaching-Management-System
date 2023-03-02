import { Body, Controller, Get, Logger, Post, Request, UseGuards } from "@nestjs/common";
import { UsersService } from "../entity/user/users.service";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./strategy/jwt-auth.guard";
import { CreateUserDto } from "../entity/user/dto/CreateUserDto";
import { EnableUserDto } from "../entity/user/dto/EnableUserDto";
import { UserLoginDto } from "src/entity/user/dto/UserLoginDto";

@Controller('auth')
export class AuthController {

  constructor(private userService:UsersService,
              private authService:AuthService) {
  }
  @Post("login")
  async login(@Body() body: UserLoginDto) {
    const user = await this.authService.validateUser(body.emailOrJobNumber, body.password);
    return this.authService.login(user);
  }
  @Post("enable")
  async enable(@Body() body: EnableUserDto) {
    await this.authService.enableUser(body.jobNumber,body.email,body.password)
  }
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req): any {
    return req.user;
  }
}
