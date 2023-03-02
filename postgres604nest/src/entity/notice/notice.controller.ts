import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/strategy/jwt-auth.guard";
import { InjectRepository } from "@nestjs/typeorm";
import { Course } from "../course/course";
import { Repository } from "typeorm";
import { Users } from "../user/users";
import { Notice } from "./notice";
import { NoticeFile } from "./notice-file";
import { EventService } from "../event/event.service";
import { title } from "process";

@Controller('notice')
export class NoticeController{
  constructor(
    private eventService:EventService,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,//course仓库

    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @InjectRepository(NoticeFile)
    private noticeFileRepository: Repository<NoticeFile>,
    @InjectRepository(Notice)
    private noticeRepository: Repository<Notice>,
  ) {
  }
  @Post("createNotice")
  @UseGuards(JwtAuthGuard)
  async createNotice(@Request() req, @Body() body: { title: string,content:string, courseId?: number, }) {
    const notice = new Notice();
    notice.title = body.title;
    notice.content = body.content;
    let description='';
    if(body.courseId){
      notice.course=await this.courseRepository.findOne(body.courseId);
      description=`课程《${notice.course.name}》公告:${body.title}`;
      this.eventService.addEvent(new Date(),description,1,0,notice.course.id)
    }
    else{
      description=`公告:${body.title}`;
      this.eventService.addEvent(new Date(),description,2,0,0)
    }

      
    return  this.noticeRepository.save(notice);
  }
  @Post("addNoticeFile")
  @UseGuards(JwtAuthGuard)
  async addNoticeFile(@Request() req, @Body() body: { url: string, noticeId: number, name: string }) {
    const notice = await this.noticeRepository.findOne(body.noticeId,{
      relations:['files']
    });
    const file= new NoticeFile()
    file.creator = await this.userRepository.findOne(req.user.id);
    file.name=body.name
    file.url=body.url
    file.notice=notice
    return this.noticeFileRepository.save(file)
  }
  @Post("getAllNotice")
  @UseGuards(JwtAuthGuard)
  async getAllNotice(@Request() req, @Body() body: { }) {
    return this.noticeRepository.find({
      where:{course:null},
      relations:['files']
    })
  }
  @Post("getAllNoticeByCourseId")
  @UseGuards(JwtAuthGuard)
  async getAllNoticeByCourseId(@Request() req, @Body() body: {courseId:number }) {
    return this.noticeRepository.find({
      where:{course:body.courseId},
      relations:['files']
    })
  }

  @Post("getDetailByAnnounceId")
  @UseGuards(JwtAuthGuard)
  async getDetailByAnnounceId(@Request() req, @Body() body: {announceId:number }){
    return this.noticeRepository.findOne({
      where:{
        id:body.announceId
      }
    })
  }
}
