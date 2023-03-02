import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './entity/user/users.service';
import { UsersModule } from './entity/user/users.module';
import { CourseService } from './entity/course/course.service';
//import { CourseController } from './entity/course/course.controller';
import {CourseModule} from './entity/course/course.module'
import { TypeOrmModule } from "@nestjs/typeorm";
import env from "./env";
import { AuthService } from "./auth/auth.service";
import { Users } from "./entity/user/users";
import { Course } from './entity/course/course';
import { Project } from "./entity/project/project";
import { ProjectModule } from "./entity/project/project.module";
import { MailModule } from './mail/mail.module';
import { FileModule } from "./file/file.module";
import { ScoreModule } from "./entity/score/score.module";
import { NoticeModule } from "./entity/notice/notice.module";
import { PracticeModule } from './entity/practice/practice.module';
import { HomeworkModule } from './entity/homework/homework.module';
import { EventModule } from './entity/event/event.module';

@Module({
  imports: [ TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'i318026t27.wicp.vip',
    port: 45592,
    username: 'postgres',
    password:"123456",
    database: 'postgres',
    entities: [Users,Project,Course],
    autoLoadEntities: true,
    synchronize: env.NODE_ENV === 'development',
  }),AuthModule, UsersModule,CourseModule,ProjectModule, MailModule,FileModule,ScoreModule,NoticeModule,PracticeModule,HomeworkModule,EventModule],
  controllers: [AppController,],
  providers: [AppService, UsersService,CourseService],
})
export class AppModule {}
