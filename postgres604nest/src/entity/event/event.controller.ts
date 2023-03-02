import { Body, Controller, Logger, Post, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/strategy/jwt-auth.guard";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "../user/users";
import { Repository } from "typeorm";
import { Course } from '../course/course'
import { Project } from "../project/project";
import { UsersType } from "../user/users";
import { Practice } from "../practice/practice";
import { Group } from "../course/group";
import { Homework } from "../homework/homework";
import { Event } from "./event";
import { In } from "typeorm";
import { EventService } from "./event.service";

@Controller('event')
export class EventController {
  constructor(

    private eventService:EventService,
                @InjectRepository(Users)
                private userRepository: Repository<Users>,
                
                @InjectRepository(Course)
                private courseRepository: Repository<Course>,
                
                @InjectRepository(Project)
                private projectRepository: Repository<Project>,

                @InjectRepository(Practice)
                private practiceRepository: Repository<Practice>,

                @InjectRepository(Group)
                private groupRepository: Repository<Group>,
                
                @InjectRepository(Homework)
                private homeworkRepository: Repository<Homework>,
                
                @InjectRepository(Event)
                private eventRepository: Repository<Event>,) {
  }

  @Post("addEvent")
  @UseGuards(JwtAuthGuard)
  async addEvent(@Request() req, @Body() body: {
    time:Date,
    description:string,
    type:number,
    userId:number,
    courseId:number
  }){

    return this.eventService.addEvent(
      body.time,
      body.description,
      body.type,
      body.userId,
      body.courseId);

  }

  @Post("getEvent")
  @UseGuards(JwtAuthGuard)
  async getEvent(@Request() req, @Body() body: {}){

    let user=req.user;
    let courses=[]

    if(user.type==UsersType.TEACHER){
      let res=await this.userRepository.findOne({
        where:{
          id:user.id
        },
        relations:['teachingCourses']
      })
      res.teachingCourses.forEach(item=>{
        courses.push(item.id);
      })
    }
    else if(user.type=UsersType.STUDENT){
     let res=await this.userRepository.findOne({
       where:{
         id:user.id
       },
       relations:['participatingCourses']
     })
     res.participatingCourses.forEach(item=>{
      courses.push(item.id);
    })
    }
    else if(user.type==UsersType.RESPONSIBLE_TEACHER){
     let res=await this.userRepository.findOne({
       where:{
         id:user.id
       },
       relations:['teachingCourses']
     })
     res.teachingCourses.forEach(item=>{
      courses.push(item.id);
    })
    }

    return this.eventRepository.find({
      where:[
        {
          type:0,
          user:user
        },
        {
          type:1,
          course:In(courses)
        },
        {
          type:2
        }
      ],
      order:{
        time:'DESC'
      }
    })
  }
}
