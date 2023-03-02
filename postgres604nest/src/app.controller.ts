import { Request,Controller, Get, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AppService } from './app.service';
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser, JwtAuthGuard } from "./auth/strategy/jwt-auth.guard";
import { AuthService } from "./auth/auth.service";

@Controller()
export class AppController {


}
