import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "../user/users";
import { Course } from "../course/course";
import { Score } from "../score/score";
import { ScoreController } from "./score.controller";
import { Project } from '../project/project';
import { Practice } from '../practice/practice';
import { Group } from '../course/group';
import { Homework } from '../homework/homework';
import { EventService } from '../event/event.service';
import { Event } from '../event/event';

@Module({
  imports:[TypeOrmModule.forFeature([Score,Users,Course,Project,Practice,Group,Homework,Event]),],
  controllers: [ScoreController],
  providers: [EventService]
})
export class ScoreModule {}
