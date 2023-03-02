import { Body, Controller, Logger, Post, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/strategy/jwt-auth.guard";
import { CourseService } from "../course/course.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "../user/users";
import { Repository } from "typeorm";
import { Score } from "./score";
import { Course } from '../course/course'
import { ProjectFile } from "../project/project-file";
import { Project } from "../project/project";
import { ScoreType } from "./score";
import { UsersType } from "../user/users";
import { Practice } from "../practice/practice";
import { Group } from "../course/group";
import { Homework } from "../homework/homework";
import { EventService } from "../event/event.service";
//import moment from "moment";

@Controller("score")
export class ScoreController {
  constructor(
                private eventService :EventService,
                @InjectRepository(Users)
                private userRepository: Repository<Users>,

                @InjectRepository(Score)
                private scoreRepository: Repository<Score>,
                
                @InjectRepository(Course)
                private courseRepository: Repository<Course>,
                
                @InjectRepository(Project)
                private projectRepository: Repository<Project>,

                @InjectRepository(Practice)
                private practiceRepository: Repository<Practice>,

                @InjectRepository(Group)
                private groupRepository: Repository<Group>,
                
                @InjectRepository(Homework)
                private homeworkRepository: Repository<Homework>,) {
  }


  // @Post("findScoresByCourse")
  // @UseGuards(JwtAuthGuard)
  // async findScoresByCourse(@Request() req, @Body() body: {  courseId: number}) {
  //   //? 如果user是老师,拥有权限.

  //   return this.scoreRepository.find({
  //     where: {
  //       course: body.courseId,
  //       user:req.user.id
  //     },
  //     relations:['course','courseScoreRatio']
  //   });
  // }
  @Post("signIn")
  @UseGuards(JwtAuthGuard)
  async signIn(@Request() req, @Body() body: {}){
    let user=req.user;
    let now=new Date();
    let record=await this.scoreRepository.findOne({
      where:{
        user:user,
        type:ScoreType.ATTENDANCE
      }
    })
    if(record==undefined){
      //第一次签到，创建一个新的记录
      return this.scoreRepository.insert({
        user:user,
        score:1,
        editTime:now,
        type:ScoreType.ATTENDANCE
      })
    }
    else{
      var moment=require('moment');
      let m1=moment(record.editTime);
      let m2=moment(now);
      let duration = m2.diff(m1, 'hours');
      if(duration>=24){
        record.score++;
        record.editTime=new Date();
        return this.scoreRepository.save(record);
      }
      else{
        return '今日已签到';
      }
    }
  }



  @Post("findAllByCourse")
  @UseGuards(JwtAuthGuard)
  async findAllByCourse(@Request() req, @Body() body: { courseId: number}){
    let user=req.user;
    if(user.type!=UsersType.RESPONSIBLE_TEACHER)return [];
    else{
      return this.scoreRepository.find({
        where:[{
          course: body.courseId,
        },
        {
          type:ScoreType.ATTENDANCE,
          user:user
        }]
      })
    }
  }


  @Post("findScoresByCourse")
  @UseGuards(JwtAuthGuard)
  async findScoresByCourse(@Request() req, @Body() body: { courseId: number}) {
      //? 如果user是老师,拥有权限.

      let user=req.user;
      return this.scoreRepository.find({
      where: [{
        course: body.courseId,
        user:req.user.id
      },{
        type:ScoreType.ATTENDANCE,
        user:user
      }],
        relations:['project','practice']
      });
    }

  @Post("setProjectScore")
  @UseGuards(JwtAuthGuard)
  async setProjectScore(@Request() req, 
  @Body() body: {
    userId:number,
    courseId:number,
    projectId:number,
    score:number
  }){
    let course=await this.courseRepository.findOne({
      where:{
        id:body.courseId
      }
    })
    
    let project=await this.projectRepository.findOne({
      where:{
        id:body.projectId
      }
    })

    let user=await this.userRepository.findOne(body.userId)

    let find=await this.scoreRepository.findOne({
      where:{
        user:user,
        type:ScoreType.PROJECT,
        project:project,
        course:course,
      }
    })

    let description=`课程《${course.name}》的项目《${project.name}》已评分`;
    this.eventService.addEvent(new Date(),description,0,user.id,body.courseId)
    if(find!=undefined){
      find.score=body.score;
      find.editTime=new Date();
      //return find;
      let homework=await this.homeworkRepository.findOne({
        where:{
          creator:{id:body.userId},
          project:body.projectId
        }
      })

      console.log(homework)
      homework.isGrade=true;
      this.homeworkRepository.update(homework.id,homework);
      return this.scoreRepository.update(find.id,find);
    }
    else {
      await this.scoreRepository.insert({
        user:user,
        type:ScoreType.PROJECT,
        score:body.score,
        project:project,
        course:course,
        editTime:new Date()
      })

      let homework=await this.homeworkRepository.findOne({
        where:{
          creator:{id:body.userId},
          project:body.projectId
        }
      })

      console.log(homework)
      homework.isGrade=true;
      return this.homeworkRepository.update(homework.id,homework);
      
    }
  }
  

  
  @Post("setPracticeScore")
  @UseGuards(JwtAuthGuard)
  async setPracticeScore(@Request() req, 
  @Body() body: {
    courseId:number,
    userId:number,
    practiceId:number,
    score:number
  }){
    let course=await this.courseRepository.findOne({
      where:{
        id:body.courseId
      }
    })
    
    let practice=await this.practiceRepository.findOne({
      where:{
        id:body.practiceId
      }
    })

    let user=await this.userRepository.findOne({
      where:{
        id:body.userId
      }
    })

    return this.scoreRepository.insert({
      user:user,
      type:ScoreType.EXERCISE,
      score:body.score,
      practice:practice,
      course:course,
      editTime:new Date()
    })
  }

  @Post("caculatePracticeScore")
  @UseGuards(JwtAuthGuard)
  async caculatePracticeScore(@Request() req, 
  @Body() body: {
    courseId:number,
    practiceId:number,
  }){

    let practice=await this.practiceRepository.findOne({
      where:{
        id:body.practiceId
      }
    })

    //if(practice.marked)return '本次对抗练习已经评分';

    let course=await this.courseRepository.findOne({
      where:{
        id:body.courseId
      }
    })

    

    let groups=await this.groupRepository.find({
      where:{
        course:body.courseId
      },
      relations:['users']
    })

    //return groups;
    //取出每个人的得分
    for(let i=0;i<groups.length;i++){
      for(let j=0;j<groups[i].users.length;j++){
        let score=await this.scoreRepository.findOne({
          where:{
            user:groups[i].users[j].id,
            course:body.courseId,
            practice:body.practiceId
          }
        })

        if(score==undefined){
          let user_T=await this.userRepository.findOne({
            where:{
              id:groups[i].users[j].id
            }
          })
          score=new Score();
          score.user=user_T;
          score.course=course,
          score.practice=practice;
          score.type=ScoreType.EXERCISE;
          score.score=0;
          score.practiceScore=0;
          score.editTime=new Date();
          await this.scoreRepository.save(score);
        }
        groups[i].users[j].practiceScore=score;
      }
    }

    for(let i=0;i<groups.length;i++){
      groups[i].users.sort((a,b)=>{
        let scoreA=a.practiceScore.practiceScore;
        if(scoreA==undefined)scoreA=0;
        let scoreB=b.practiceScore.practiceScore;
        if(scoreB==undefined)scoreB=0;
        if (scoreA < scoreB) {
          return 1;
        } else if (scoreA > scoreB) {
            return -1;
        } else {
            return 0;
        }            
      })
    }

    for(let i=0;i<groups.length;i++){
      for(let j=0;j<groups[i].users.length;j++){
        if(j==0){
          //第一个人得5分
          let score=groups[i].users[j].practiceScore;
          score.score=5;
          await this.scoreRepository.update(score.id,score);
        }
        else{
          //其他人得3分
          let score=groups[i].users[j].practiceScore;
          score.score=3;
          await this.scoreRepository.update(score.id,score);
        }
      }
    }

    practice.marked=true;
    await this.practiceRepository.update(practice.id,practice);

    let description=`课程《${course.name}》的对抗练习《${practice.name}》已评分`;
    return this.eventService.addEvent(
      new Date(),
      description,
      1,
      0,
      course.id
    )
  }
}
