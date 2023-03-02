import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "../user/users";
import { Project } from "./project";
import { ProjectService } from "./project.service";
import { ProjectController } from "./project.controller";
import { Course } from "../course/course";
import { Score } from "../score/score";
import { ProjectFile } from "./project-file";
import { Homework } from '../homework/homework';
import { HomeworkService } from '../homework/homework.service';
import { EventService } from '../event/event.service';
import { Event } from '../event/event';

@Module({
  imports:[TypeOrmModule.forFeature([Project,Users,Course,Score,ProjectFile,Homework,Event]),],
  providers: [ProjectService,HomeworkService,EventService],
  controllers: [ProjectController],
})
export class ProjectModule {}
