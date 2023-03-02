import { Body, ConsoleLogger, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/strategy/jwt-auth.guard";
import { CourseService } from "../course/course.service";
import { ProjectService } from "./project.service";

@Controller("project")
export class ProjectController {
  constructor(private projectService: ProjectService) {
  }

  @Post("myProjects")
  @UseGuards(JwtAuthGuard)
  async myProjects(@Request() req) {
    return await this.projectService.findByUserId(req.user.id);
  }

  @Post("createProject")
  @UseGuards(JwtAuthGuard)
  async createProject(@Request() req, @Body() body: { name: string, fullMark:number, desc: string,courseId: number, startTime:Date,endTime:Date}) {
    console.log(body);
    return await this.projectService.createProject(req.user.id,
      body.name,
      body.courseId,
      body.startTime,
      body.endTime,
      body.desc,
      body.fullMark
    );
  }

  @Post("attendProject")
  @UseGuards(JwtAuthGuard)
  async attendProject(@Request() req, @Body() body: { projectId: number }) {
    return this.projectService.attendProject(body.projectId, req.user.id);
  }

  @Post("addProjectFile")
  @UseGuards(JwtAuthGuard)
  async addProjectFile(@Request() req, @Body() body: { url: string, projectId: number, name: string }) {
    console.log(body)
    return this.projectService.addProjectFile(body.url, body.projectId, req.user.id, body.name);
  }

  // @Post("assignProjectScore")
  // @UseGuards(JwtAuthGuard)
  // async assignProjectScore(@Request() req, @Body() body: {  projectId: number,score:number,courseScoreRatioId:number }) {
  //   //? 如果user是老师,拥有权限.
  // //小组成员平分这些分数
  //   return this.projectService.assignProjectScore( body.projectId,  body.score,body.courseScoreRatioId);
  // }

  @Post("findByCourseId")
  @UseGuards(JwtAuthGuard)
  async findByCourseId(@Request() req,@Body() body: { courseId: number }){
    console.log(body);
    console.log(body.courseId);
    return await this.projectService.findByCourseId(req.user.id, body.courseId);
  }

  @Post("findById")
  @UseGuards(JwtAuthGuard)
  async findById(@Body() body: { id: string }){
    console.log(body);
    console.log(body.id);
    return await this.projectService.findById(body.id);
  }
}
