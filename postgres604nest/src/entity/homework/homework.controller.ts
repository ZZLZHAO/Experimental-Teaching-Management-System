import { Body, ConsoleLogger, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/strategy/jwt-auth.guard";
import { HomeworkService } from './homework.service';

@Controller('homework')
export class HomeworkController {
  constructor(private readonly homeworkService: HomeworkService) {

  }

  @Post("findByProjectId")
  @UseGuards(JwtAuthGuard)
  async findByProjectId(@Request() req,@Body() body: { projectId:number}) {
    console.log(body);
    return await this.homeworkService.findByProjectId(body.projectId);
  }

  @Post("findByUserId")
  @UseGuards(JwtAuthGuard)
  async findByUserId(@Request() req,@Body() body: { projectId:number}) {
    console.log(body);
    return await this.homeworkService.findByUserId(req.user.id, body.projectId);
  }

  @Post("addHomework")
  @UseGuards(JwtAuthGuard)
  async addHomework(@Request() req, @Body() body: { name: string, url: string, projectId:number}) {
    console.log(body);
    return await this.homeworkService.addHomework(req.user.id,
      body.name,
      body.url,
      body.projectId,
    );
  }
}
