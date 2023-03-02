import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../course/course';
import { Group } from '../course/group';
import { Homework } from '../homework/homework';
import { Practice } from '../practice/practice';
import { Project } from '../project/project';
import { Users } from '../user/users';
import { Event } from './event';

@Injectable()
export class EventService {
    constructor(  @InjectRepository(Users)
                private userRepository: Repository<Users>,
                
                @InjectRepository(Course)
                private courseRepository: Repository<Course>,
                
                @InjectRepository(Event)
                private eventRepository: Repository<Event>,) {
  }

  async addEvent(time:Date,
    description:string,
    type:number,
    userId:number,
    courseId:number){
        if(type==0){//个人事件
            let user=await this.userRepository.findOne({
              where:{id:userId}
            })
      
            return this.eventRepository.insert({
              time:time,
              description:description,
              type:0,
              user:user
            })
          }
      
          else if(type==1){//课程事件
            let course=await  this.courseRepository.findOne({
              where:{id:courseId}
            })
      
            return this.eventRepository.insert({
              time:time,
              description:description,
              type:1,
              course:course
            })
          }
      
          else if(type==2){//全体事件
            return this.eventRepository.insert({
              time:time,
              description:description,
              type:2
            })
          }
    }
}
