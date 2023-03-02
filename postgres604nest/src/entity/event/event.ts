import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users, UsersType } from "../user/users";
import { Project } from "../project/project";
import { Course } from "../course/course";
import { Practice } from "../practice/practice";
import { Score } from "../score/score";
import { Group } from '../course/group';
import { Homework } from '../homework/homework';
// import { CourseScoreRatio } from "../course/course-score-ratio";



@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz',nullable:true }) // Recommended,with timezone
  time: Date;//记录上次修改的时间，一天只能签到一次

  @Column({ default:'' })
  description:string;

  @Column({ default:0 })
  type:number;//类别，0->个人事件 1->课程事件 2->全体事件

  @ManyToOne(()=>Users)
  @JoinColumn()
  user: Users;
  
  @ManyToOne(() => Course)
  @JoinColumn()
  course: Course;

  // @ManyToOne(()=>CourseScoreRatio)
  // @JoinColumn()
  // courseScoreRatio:CourseScoreRatio
}
