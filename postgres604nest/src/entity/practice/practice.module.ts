import { Module } from '@nestjs/common';
import { PracticeService } from './practice.service';
import { PracticeController } from './practice.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Practice } from './practice';
import { Problem } from './problem';
import { Users } from "../user/users";
import { Score } from "../score/score";
import { Course } from '../course/course';
import { Event } from '../event/event';
import { EventService } from '../event/event.service';

@Module({
  imports:[TypeOrmModule.forFeature([Practice,Problem,Users,Score,Course,Event]),],
  controllers: [PracticeController],
  providers: [PracticeService,EventService]
})
export class PracticeModule {}
