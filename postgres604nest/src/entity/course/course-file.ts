import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Course } from "./course";
import { Users } from "../user/users";


export enum CourseFileType {
  COURSE = 'course',
  EXERCISE='exercise',
  PROJECT='project'
}
@Entity()
export class CourseFile {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ default:'' })
  name:string
  @Column({ default:'' })
  url:string
  @Column({
    type: "enum",
    enum: CourseFileType,
    default: CourseFileType.PROJECT
  })
  type:CourseFileType
  @ManyToOne((type)=>Users)
  creator:Users;

  @ManyToOne((type)=>Course)
  course: Course;
  @Column({ type: "timestamptz", default: new Date() }) // Recommended,with timezone
  createdTime: Date;
}
