import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProjectFile } from "../project/project-file";
import { NoticeFile } from "./notice-file";
import { Course } from "../course/course";

@Entity()
export class Notice {

  @PrimaryGeneratedColumn()
  id: number;
  @Column({default:''})
  title:string
  @Column({default:''})
  content:string
  @OneToMany(type => NoticeFile, file => file.notice)
  files:[]
  @ManyToOne(() => Course,{nullable:true})
  @JoinColumn()
  course: Course;
  @Column({ type: 'timestamptz',default:new Date() }) // Recommended,with timezone
  createdTime: Date;
}
