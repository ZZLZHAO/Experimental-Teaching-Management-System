import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from "./users";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from './users.controller';
import { Course } from "../course/course";
import { AuthModule } from "../../auth/auth.module";
import { MailModule } from "../../mail/mail.module";
import { Group } from '../course/group';

@Module({
  imports:[TypeOrmModule.forFeature([Users,Course,Group]),MailModule],
  providers: [UsersService],
  exports: [UsersService,TypeOrmModule],
  controllers: [UsersController],
})
export class UsersModule {}
