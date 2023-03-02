import { Module } from '@nestjs/common';
import { HomeworkService } from './homework.service';
import { HomeworkController } from './homework.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Project } from '../project/project';
import { Users } from '../user/users';
import { Homework } from './homework';

@Module({
  imports:[TypeOrmModule.forFeature([Project,Users,Homework]),],
  controllers: [HomeworkController],
  providers: [HomeworkService]
})

export class HomeworkModule {}
