import { Body, Controller, Logger, Post, Request, UseGuards } from "@nestjs/common";
import { CreateCourseDto } from "./dto/CreateCourseDto";
import { CourseService } from "./course.service";
//import { AuthService } from "src/auth/auth.service";
import { Course } from "./course";
import { JwtAuthGuard } from "../../auth/strategy/jwt-auth.guard";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Users, UsersType } from "../user/users";
import { ScoreType } from "../score/score";
import { Group } from "./group";
import { EventService } from "../event/event.service";

@Controller("course")
export class CourseController {
  constructor(private courseService: CourseService,
              private eventService:EventService,
              @InjectRepository(Course)
              private courseRepository: Repository<Course>,//course仓库
              @InjectRepository(Users)
              private userRepository: Repository<Users>,
              @InjectRepository(Group)
              private groupRepository: Repository<Group>) {

  }


  @Post("addTeacher")
  @UseGuards(JwtAuthGuard)
  async addTeacher(@Request() req, @Body() body: { courseId: number, teacherId: number }): Promise<Course> {
    console.log(body);
    // console.log(body.name);
    // console.log(body.creatorId);
    //return await this.courseService.create(Object.assign({creatorId:body.creatorId},body));
    let course = await this.courseRepository.findOne(body.courseId, { relations: ["teachers"] });
    Logger.debug(course);
    let teacher = await this.userRepository.findOne(body.teacherId);
    if (course.teachers) {
      course.teachers.push(teacher);
    } else {
      course.teachers = [teacher];
    }
    return this.courseRepository.save(course);
  }

  @Post("create")
  @UseGuards(JwtAuthGuard)
  async create(@Request() req, @Body() body: CreateCourseDto): Promise<Course> {
    console.log(body);
    console.log(body.name);
    console.log(body.creatorId);
    return await this.courseService.create(Object.assign({ creatorId: body.creatorId }, body));
  }

  @Post("createdCourses")
  @UseGuards(JwtAuthGuard)
  async createdCourses(@Request() req, @Body() body: {}){
    let user=req.user;
    return this.courseRepository.find({
      where:{
        creator:user
      },
      relations:['teachers','creator']
    })
  }

  @Post("closeCourse")
  @UseGuards(JwtAuthGuard)
  async closeCourse(@Request() req, @Body() body: {courseId:number}){
    let user=req.user;

    let course=await this.courseRepository.findOne({
      where:{
        id:body.courseId
      }
    })

    course.isCourseOpen=false;
    await this.courseRepository.update(course.id,course);

    let description=`课程《${course.name}》已关闭`;

    return this.eventService.addEvent(
      new Date(),
      description,
      2,
      0,
      0
    )
  }

  @Post("editWeight")
  @UseGuards(JwtAuthGuard)
  async editWeight(@Request() req, @Body() body: {
    courseId:number,
    usualRatio:number,
    projectRatio:number,
    practiceRatio:number,
  }){
    let user=req.user;
    let course=await this.courseRepository.findOne({
      where:{
        id:body.courseId
      }
    })

    course.usualRatio=body.usualRatio;
    course.projectRatio=body.projectRatio;
    course.practiceRatio=body.practiceRatio;

    await this.courseRepository.update(course.id,course);

    let description=`课程《${course.name}》成绩权重已更改`;

    return this.eventService.addEvent(
      new Date(),
      description,
      1,
      0,
      course.id
    )
  }

  @Post("myCourses")
  @UseGuards(JwtAuthGuard)
  async myCourses(@Request() req, @Body() body: {}){
   let user=req.user;
   if(user.type==UsersType.TEACHER){
     let res=await this.userRepository.findOne({
       where:{
         id:user.id
       },
       relations:['teachingCourses',"teachingCourses.teachers",'teachingCourses.creator']
     })
     return res.teachingCourses;
   }
   else if(user.type=UsersType.STUDENT){
    let res=await this.userRepository.findOne({
      where:{
        id:user.id
      },
      relations:['participatingCourses',"participatingCourses.teachers",'participatingCourses.creator']
    })
    return res.participatingCourses;
   }
   else if(user.type==UsersType.RESPONSIBLE_TEACHER){
    let res=await this.userRepository.findOne({
      where:{
        id:user.id
      },
      relations:['teachingCourses',"teachingCourses.teachers",'teachingCourses.creator']
    })
    return res.teachingCourses;
   }
  }

  @Post("findByCourseId")
  @UseGuards(JwtAuthGuard)
  async findByCourseId(@Body() body: { courseId: number }): Promise<Course> {
    
    console.log(body);
    console.log(body.courseId);
    return await this.courseService.findByCourseId(body.courseId);
  }

  @Post("participate")
  @UseGuards(JwtAuthGuard)
  async participate(@Request() req, @Body() body: { courseId: number }) {

    return await this.courseService.participate(req.user.id, body.courseId);
  }

  // @Post("addCourseScoreRatio")
  // @UseGuards(JwtAuthGuard)
  // async addCourseScoreRatio(@Request() req, @Body() body: { courseId: number ,scoreName:string,scoreRatio:number,type:ScoreType,projectId?:number}) {
  //   return this.courseService.addCourseScoreRatio(body.courseId,body.scoreName,body.scoreRatio,body.type,body.projectId)
  // }

  
  getNewArray=(arr, size)=>{  // size=5，要分割的长度
    const arrNum = Math.ceil(arr.length/size); // Math.ceil()向上取整的方法，用来计算拆分后数组的长度
    let index = 0; // 定义初始索引
    let resIndex = 0; // 用来保存每次拆分的长度
    let result = [];
    while(index< arrNum){
        result[index]= arr.slice(resIndex,size+resIndex);
        resIndex += size;
        index++;
    }
    return result;
    }

  @Post("createGroup")
  @UseGuards(JwtAuthGuard)
  async createGroup(@Request() req, @Body() body: { courseId: number }) {
    let course=await this.courseRepository.findOne({
      where:{id:body.courseId},
      relations:['students']
    })
    let students=course.students;//这门课的学生列表
    let lastOne=students[students.length-1];
    let flag=false;
    if(students.length%3==1){//如果只是多出一个人，那么最后一组有四个人
      students.pop();
      flag=true;
    }

    let result=this.getNewArray(students,3);
    if(flag){
      result[result.length-1].push(lastOne);
    }

    for(let i=0;i<result.length;i++){
      let newGroup=new Group();
      newGroup.course=course;
      newGroup.users=result[i];
      await this.groupRepository.save(newGroup);
    }
    return '创建成功';
  }


  @Post("addCourseFile")
  @UseGuards(JwtAuthGuard)
  async addCourseFile(@Request() req, @Body() body: { url: string, courseId: number, name: string, type:string }) {
    console.log(body)
    return this.courseService.addCourseFile(body.url, body.courseId, req.user.id, body.name,body.type);
  }

  @Post("findCourseFiles")
  @UseGuards(JwtAuthGuard)
  async findCourseFiles(@Request() req,@Body() body: { courseId:number,type:string}) {
    console.log(body);
    return await this.courseService.findCourseFiles(body.courseId,body.type);
  }
}
