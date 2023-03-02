import { Column, Entity, JoinColumn,JoinTable, ManyToOne, ManyToMany,OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users, UsersType } from "../user/users";
import { Project } from "../project/project";
import { Course } from "../course/course";
import { Practice } from "../practice/practice";
// import { CourseScoreRatio } from "../course/course-score-ratio";


@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(()=>Course)
  @JoinColumn()
  course:Course;//对应的课程

  @ManyToMany(type=>Users,user=>user.groups)
  @JoinTable()
  users:Users[]
}
