import { Module } from '@nestjs/common';
import { CourseService } from './course.service'; 
import { Course } from "./course";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CourseController } from './course.controller';
import { Users } from "../user/users";
import { Project } from "../project/project";
import { Group } from './group';
import { CourseFile } from './course-file';
import { EventService } from '../event/event.service';
import { Event } from '../event/event';

@Module({
  imports:[TypeOrmModule.forFeature([Course,Users,Project,Group,CourseFile,Event]),],
  providers: [CourseService,EventService],
  exports: [CourseService,TypeOrmModule],
  controllers: [CourseController],
})
export class CourseModule {}
