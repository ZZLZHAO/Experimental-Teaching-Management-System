import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/strategy/jwt-auth.guard";
import { InjectRepository } from "@nestjs/typeorm";
import { Practice } from "./practice";
import { Problem } from "./problem";
import { Repository } from "typeorm";
import { Users } from "../user/users";
import { Score, ScoreType } from "../score/score";
import { Course } from "../course/course";
import { EventService } from "../event/event.service";

@Controller('practice')
export class PracticeController {
  constructor(  
                private eventService:EventService,
                @InjectRepository(Practice)
                private practiceRepository: Repository<Practice>,

                @InjectRepository(Problem)
                private problemRepository: Repository<Problem>,

                @InjectRepository(Users)
                private userRepository: Repository<Users>,
                
                @InjectRepository(Score)
                private scoreRepository: Repository<Score>,
                @InjectRepository(Course)
                private courseRepository: Repository<Course>,){

  }

  @Post("createPractice")
  @UseGuards(JwtAuthGuard)
  async create(@Request() req, @Body() body: {
    courseId:number,
    startTime:Date,
    endTime:Date,
    timeLimit:number,
    name:string,
    problems:Array<Problem>
  }){
    console.log(body.problems);
    let user=req.user;
    let course=await this.courseRepository.findOne({where:{id:body.courseId}});
    let insertRes=await this.practiceRepository.insert({
      name:body.name,
      timeLimit:body.timeLimit,
      creator:user,
      course:course,
      createdTime:new Date(),
      startTime:body.startTime,
      endTime:body.endTime
    })

    let practiceId=insertRes.raw[0].id;
    if(practiceId==null)return '创建失败';
    else{
      let practice=await this.practiceRepository.findOne({where:{id:practiceId}});
      for(let i=0;i<body.problems.length;i++){
        await this.problemRepository.insert({
          description:body.problems[i].description,
          type:body.problems[i].type,
          options:body.problems[i].options,
          answer:body.problems[i].answer,
          practice:practice,
        })
        .catch(err=>{
          return '创建失败';
        })
      }

      let description=`课程《${course.name}》已创建对抗练习《${body.name}》`;
      let description2=`课程《${course.name}》的对抗练习《${body.name}》截止`;
      await this.eventService.addEvent(
        new Date(),
        description,
        1,
        0,
        course.id
      );

      return this.eventService.addEvent(
        body.endTime,
        description2,
        1,
        0,
        course.id
      );
    }
  }

  @Post("addProblem")
  @UseGuards(JwtAuthGuard)
  async addProblem(@Request() req, @Body() body: {
    description:string,
    type:number,
    options:string,
    answer:string,
    practiceId:number
  }){
    let practice=await this.practiceRepository.findOne({where:{id:body.practiceId}});
    if(practice!=undefined){
      return this.problemRepository.insert({
        description:body.description,
        type:body.type,
        options:body.options,
        answer:body.answer,
        practice:practice
      })
    }
    else{
      return '找不到对应的练习';
    }
  }

  @Post("getPracticeByCourseId")
  @UseGuards(JwtAuthGuard)
  async getPracticeByCourseId(@Request() req, @Body() body: {
    courseId:number
  }){
    let list=await this.practiceRepository.find({
      where:{
        course:body.courseId
      }
    })

    for(let i=0;i<list.length;i++){
      let record=await this.scoreRepository.findOne({
        where:{
          user:req.user,
          course:body.courseId,
          practice:list[i].id,
          type:ScoreType.EXERCISE
        }
      })

      if(record==undefined){
        list[i].submited=false;
      }
      else{list[i].submited=true;}
    }

    return list;
  }

  @Post("getProblemsByPracticeId")
  @UseGuards(JwtAuthGuard)
  async getProblemsByPracticeId(@Request() req, @Body() body: {
    practiceId:number
  }){
    return this.problemRepository.find({
      where:{
        practice:body.practiceId
      }
    })
  }


  @Post("submitPractice")
  @UseGuards(JwtAuthGuard)
  async submitPractice(@Request() req, @Body() body: {
    practiceId:number,
    timeLeft:number,
    courseId:number,
    answer:string
  }){
    let answer=JSON.parse(body.answer);
    //return answer;
    let count=0;
    for(let i=0;i<answer.length;i++){
      let problem=await this.problemRepository.findOne({
        where:{
          id:answer[i].id
        }
      })
      if(problem.answer==answer[i].answer)count++;
    }

    let score=count*10000+body.timeLeft;

    let user=req.user;

    let course=await this.courseRepository.findOne({where:{id:body.courseId}});

    let practice=await this.practiceRepository.findOne({where:{id:body.practiceId}});

    await this.scoreRepository.insert({
      user:user,
      type:ScoreType.EXERCISE,
      score:0,
      practiceScore:score,
      editTime:new Date(),
      practice:practice,
      course:course
    })

    let description=`提交了课程《${course.name}》的对抗练习《${practice.name}》`;
    return this.eventService.addEvent(
      new Date(),
      description,
      0,
      user.id,
      0
    );
  }

}
