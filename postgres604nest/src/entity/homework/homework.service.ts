import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Project } from '../project/project';
import { Users } from '../user/users';
import { Homework } from './homework';

@Injectable()
export class HomeworkService {
    constructor(
        @InjectRepository(Homework)
        private homeworkRepository: Repository<Homework>,//user仓库
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,//user仓库
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
      ) {
      }

      findByProjectId(projectId: number): Promise<Homework[]> {
        return this.homeworkRepository.find({
            where:{
                project:{id:projectId}
            },
            relations: ["creator","project"]
        });
    }

    findByUserId(userId:number, projectId: number) {
        return this.homeworkRepository.findOne({
            where:{
                project:{id:projectId},
                creator:{id:userId}
            },
            relations: ["creator","project"]
        });
    }

    async addHomework(creatorId: number, name: string, url: string,projectId:number) {
        let homework=await this.homeworkRepository.findOne({where:{
            project:{id:projectId},
            creator:{id:creatorId},
        }})
        if(homework==undefined){
            homework = new Homework();
            homework.name = name;
            homework.url = url;
            homework.creator = await this.userRepository.findOne(creatorId);
            homework.project = await this.projectRepository.findOne(projectId);
            const date = new Date();
            date.setMonth(date.getMonth());
            // project.endTime = date;
            homework.createdTime=date;
            homework.isSubmit=false;
        }
        else{
            homework.name = name;
            homework.url = url;
            const date = new Date();
            date.setMonth(date.getMonth());
            // project.endTime = date;
            homework.createdTime=date;
            homework.isSubmit=true;
        }
        return  this.homeworkRepository.save(homework);
      }

}
