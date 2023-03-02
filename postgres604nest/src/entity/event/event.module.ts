import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "../user/users";
import { Course } from "../course/course";
import { Score } from "../score/score";
import { Project } from '../project/project';
import { Practice } from '../practice/practice';
import { Group } from '../course/group';
import { Homework } from '../homework/homework';
import { Event } from './event';

@Module({
  imports:[TypeOrmModule.forFeature([Event,Score,Users,Course,Project,Practice,Group,Homework]),],
  controllers: [EventController],
  providers: [EventService]
})
export class EventModule {}
