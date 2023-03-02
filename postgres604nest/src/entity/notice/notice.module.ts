import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Course } from "../course/course";
import { Users } from "../user/users";
import { Project } from "../project/project";
import { CourseService } from "../course/course.service";
import { CourseController } from "../course/course.controller";
import { NoticeController } from "./notice.controller";
import { NoticeFile } from "./notice-file";
import { Notice } from "./notice";
import { EventService } from "../event/event.service";
import { Event } from "../event/event";
import { Practice } from "../practice/practice";
import { Group } from "../course/group";

@Module({
  imports:[TypeOrmModule.forFeature([Course,Users,Project,Practice,Group,NoticeFile,Notice,Event]),],
  providers: [EventService],
  exports: [],
  controllers: [NoticeController],
})
export class NoticeModule{

}
