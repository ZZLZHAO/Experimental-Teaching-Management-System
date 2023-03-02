import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from "../entity/user/users.module";
import { AuthConstants } from "./strategy/constants";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from './auth.controller';
import { JwtStrategy } from "./strategy/jwt.strategy";
import { MailModule } from "../mail/mail.module";

@Module({
  imports: [ UsersModule,
    PassportModule,
    MailModule,
    JwtModule.register({
      secret: AuthConstants.JWT_SECRET,
      signOptions: { expiresIn: `${AuthConstants.JWT_EXPIRES_TIME}` },
    }),],
  providers: [AuthService,JwtStrategy],
  exports:[AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
