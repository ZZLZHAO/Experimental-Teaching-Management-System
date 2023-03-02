import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "../user/users";
import { Course } from "../course/course";
import { ProjectFile } from "./project-file";

@Entity()
export class Project{
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ default:'' })
  name:string
  @Column({ default:'' })
  desc:string
  
  submited:boolean//是否已经提交，不写在表里，取的时候判断
  
  @OneToMany(type => ProjectFile, file => file.project)//这里的course只是参数名称
  files:ProjectFile[]

  @ManyToOne((type)=>Users, creator=>creator.createdCourses)
  creator:Users;//创建者->责任教师

  @ManyToOne((type)=>Course, c=>c.projects)
  course:Course

  @ManyToMany((type)=>Users,user=>user.participatingProjects,{cascade:false})
  @JoinTable()
  participants:Users[];//参与

  @Column({ type: 'timestamptz',default:new Date() }) // Recommended,with timezone
  createdTime: Date;
  @Column({ type: 'timestamptz',nullable:false,default:new Date()  }) // Recommended,with timezone
  startTime: Date;
  @Column({ type: 'timestamptz',nullable:false ,default:new Date() }) // Recommended,with timezone
  endTime: Date;

  @Column({default:10})
  fullMark:Number;
}
