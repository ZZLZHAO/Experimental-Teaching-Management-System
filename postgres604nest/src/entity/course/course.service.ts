import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "../user/users";
import { Connection, Repository } from "typeorm";
import { CreateCourseDto } from "./dto/CreateCourseDto";
import { Course } from "./course";
import { Project } from "../project/project";
import { ScoreType } from "../score/score";
import { CourseFile, CourseFileType } from './course-file';

// This should be a real class/interface representing a user entity

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,//course仓库
    @InjectRepository(Users)
    private userRepository: Repository<Users>,//user仓库
    @InjectRepository(CourseFile)
    private courseFileRepository: Repository<CourseFile>,//course仓库
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,//user仓库

    private connection: Connection//primise对象
  ) {}

  findAll(): Promise<Course[]> {
    return this.courseRepository.find();
  }

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = new Course();
    const creator:Users=await this.userRepository.findOne(createCourseDto.creatorId);//注意这里的await
    const teachers:Users[]=await this.userRepository.findByIds(createCourseDto.teachers);

    course.name=createCourseDto.name;
    course.creator=creator;
    course.teachers=teachers;
    //三月 16日
    course.startTime=new Date(2021,2,16)
    //六月 31日
    course.endTime=new Date(2021,5,31)
    //目前先写这几个值，学生的加入应当由学生自己进行
    return this.courseRepository.save(course);//保存课程,使用了级联，可以直接返回
    /*
    creator.createdCourses.push(course);//责任教师添加课程
    teachers.forEach(t => {
        t.teachingCourses.push(course);//一般教师添加课程
    });
    
    
    await this.userRepository.save(creator);//保存到责任教师
    for(let i=0;i<teachers.length;i++){
        await this.courseRepository.save(teachers[i]);//保存到一般教师
    }
    */
    //这样保存不好，必须要先保存course再保存user，那返回值就得改，调用course的却返回user[]不好看
    //所以回去改成级联保存
  }
  async participate(userId:number,courseId:number){
    const user=await this.userRepository.findOne(userId,{
      relations:['participatingCourses']
    })
    const course=await this.courseRepository.findOne(courseId)
    console.log( user.id );
    console.log( course.id );
    user.participatingCourses.push(course)
    return this.userRepository.save(user)
  }


  async createMany(courses: Course[]) {
    await this.connection.transaction(async manager => {
      await manager.save(courses[0]);
      await manager.save(courses[1]);
    });
  }

  async addCourseFile(url: string,courseId:number,creatorId:number,fileName:string,type:string){
    const course = await this.courseRepository.findOne(courseId);
    const file= new CourseFile()
    file.creator = await this.userRepository.findOne(creatorId);
    file.name=fileName
    file.url=url
    file.course=course
    if(type==='course')
      file.type=CourseFileType.COURSE
    else if(type==='exercise')
            file.type=CourseFileType.EXERCISE
          else if(type==='exercise')
                file.type=CourseFileType.PROJECT
    return this.courseFileRepository.save(file)
  }

  async findById(courseId: string): Promise<Course> {
    return this.courseRepository.findOne(courseId);
  }
  async findAllByUserId(userId:number):Promise<Course[]>{

    return (await this.userRepository.findOne(userId,{
      relations:['participatingCourses',"participatingCourses.teachers"]
    })).participatingCourses
  }

  
  async findByCourseId(courseId: number): Promise<Course> {
    return await this.courseRepository.findOne(courseId,{
      relations:['creator','teachers']
    });
  }

  findCourseFiles(courseId: number, type:string): Promise<CourseFile[]> {
    return this.courseFileRepository.find({
        where:{
            course:{id:courseId},
            type:type
        },
        relations: ["creator","course"]
    });
}

  async remove(id: string): Promise<void> {
    await this.courseRepository.delete(id);
    }

    // async addCourseScoreRatio(courseId:number,scoreName:string,scoreRatio:number,type:ScoreType,projectId?:number){

    //   const c=await this.courseRepository.findOne(courseId)
    //   const csr=new CourseScoreRatio()
    //   csr.course=c
    //   csr.name=scoreName
    //   csr.ratio=scoreRatio
    //   if(projectId){
    //     const p=await this.projectRepository.findOne(projectId)
    //     csr.project=p
    //   }
    //   csr.type=type
    //   return this.courseScoreRatioRepository.save(csr)


    // }
}
