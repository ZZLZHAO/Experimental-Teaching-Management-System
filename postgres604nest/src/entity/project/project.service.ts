// This should be a real class/interface representing a user entity

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Course } from "../course/course";
import { Repository } from "typeorm";
import { Project } from "./project";
import { Users, UsersType } from "../user/users";
import { ProjectFile } from "./project-file";
import { Score, ScoreType } from "../score/score";
import { Homework } from "../homework/homework";
import { HomeworkService } from "../homework/homework.service";
import { ScoreController } from "../score/score.controller";
import { EventService } from "../event/event.service";
import { Recoverable } from "repl";

@Injectable()
export class ProjectService {
  constructor(
    private homeworkService: HomeworkService,
    private eventService:EventService,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,//course仓库
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,//user仓库
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
   @InjectRepository(ProjectFile)
    private projectFileRepository: Repository<ProjectFile>,
    @InjectRepository(Score)
    private scoreRepository: Repository<Score>,
    @InjectRepository(Homework)
    private homeworkRepository: Repository<Homework>,
  ) {
  }

  findById(id: string) {
    return this.projectRepository.findOne(id,{
      relations: ["files"]
    });

  }

  async findByUserId(userId: number): Promise<Project[]> {
 const user =(await this.userRepository.findOne(userId, {
      relations: ["participatingProjects","participatingProjects.files"]
    }))
    return user.participatingProjects;
  }

  async findByCourseId(userId:number, courseId: number): Promise<Project[]> {
    console.log(userId,courseId);
    let list= await this.projectRepository.find(
      {
        where:{
          course:{ id:courseId}, 
        },
        relations:['course']
    });
    
    for(let i=0;i<list.length;i++){
      let record=await this.homeworkRepository.findOne({
        where:{
          creator:{id:userId},
          project:{id:list[i].id},
        }
      })

      //if(record==undefined)record.url='';
      console.log(record)
      if(record==undefined||record.url==''){
        list[i].submited=false;
      }
      else{list[i].submited=true;}
    }

    return list;

  }

  async createProject(creatorId: number, name: string, courseId: number,startTime:Date,endTime:Date, desc='',fullMark:number) {
    const newProject = new Project();
    newProject.name = name;
    newProject.desc = desc;
    newProject.creator = await this.userRepository.findOne(creatorId);
    newProject.course = await this.courseRepository.findOne(courseId);
    newProject.startTime = startTime;
    newProject.endTime = endTime;
    newProject.fullMark=fullMark;

    // const date = new Date();
    // //四个月后项目结束
    // date.setMonth(date.getMonth() + 4);
    // project.endTime = date;
    
    let project= await this.projectRepository.save(newProject);
    let course=await this.courseRepository.findOne({
        where:{id:project.course.id},
        relations:['students']
    })
    let students=course.students;//这门课的学生列表
    let list = await this.homeworkRepository.find({
        where:{
            project:{id:project.id}
        },
        relations: ["creator","project"]
    });
    for(let i=0;i<students.length;i++){
        await this.homeworkService.addHomework(students[i].id,'未提交','',project.id);
        let find=await this.scoreRepository.findOne({
          where:{
            user:students[i].id,
            type:ScoreType.PROJECT,
            project:project,
            course:course,
          }
        })
        await this.scoreRepository.insert({
          user:students[i],
          type:ScoreType.PROJECT,
          score:0,
          project:project,
          course:course,
          editTime:new Date()
        })
      
    }

    let des1=`课程《${course.name}》的项目《${name}》开始`;
    let des2=`课程《${course.name}》的项目《${name}》截止`;
    
    this.eventService.addEvent(startTime,des1,1,0,courseId)
    this.eventService.addEvent(endTime,des2,1,0,courseId)
    return project;
  }

  async attendProject(projectId: number, userId: number) {
    const user = await this.userRepository.findOne(userId);
    const project = await this.projectRepository.findOne(projectId,{
      relations:['participants']
    });
    project.participants.push(user)
    return  this.projectRepository.save(project);
  }
  async addProjectFile(url: string,projectId:number,creatorId:number,fileName:string){
    const project = await this.projectRepository.findOne(projectId,{
      relations:['files']
    });
    const file= new ProjectFile()
    file.creator = await this.userRepository.findOne(creatorId);
    file.name=fileName
    file.url=url
    file.project=project
    return this.projectFileRepository.save(file)
  }
  // async assignProjectScore(projectId:number,score:number,courseScoreRatioId:number){
  //   const project = await this.projectRepository.findOne(projectId,{
  //     relations:['participants','course']
  //   });
  //   const students=project.participants.filter(u=>u.type===UsersType.STUDENT)
  //   const csr=await this.courseScoreRatioRepository.findOne(courseScoreRatioId)
  //   return  Promise.all(students.map((u)=>{
  //     const s=new Score()
  //     //!这里可能需要用userRepo再去找,也可能不用
  //     s.user=u
  //     //!这里可能需要用courseRepo再去找,也 可能不用
  //     s.course=project.course
  //     s.score=score/students.length
  //     s.courseScoreRatio=csr
  //     s.type=csr.type
  //     s.project=project
  //     return this.scoreRepository.save(s)
  //   }))

  // }
}
