import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users, UsersType } from "../user/users";
import { Project } from "../project/project";
import { Course } from "../course/course";
import { Practice } from "../practice/practice";
// import { CourseScoreRatio } from "../course/course-score-ratio";


export enum ScoreType {
  ATTENDANCE = 'attendance',
  EXERCISE='exercise',
  PROJECT='project'
}
@Entity()
export class Score {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(()=>Users,user=>user.scores)
  user: Users;
  
  @Column({
    type: "enum",
    enum: ScoreType,
    default: ScoreType.PROJECT
  })
  type:ScoreType
  
  @Column({ default:0 })//百分制得分
  score: number;

  @Column({ default:0 })//对抗练习得分的权重，计算方式为 正确题数*10000+剩余时间(s)
  practiceScore: number;

  @Column({ type: 'timestamptz',nullable:true }) // Recommended,with timezone
  editTime: Date;//记录上次修改的时间，一天只能签到一次
  
  @ManyToOne(() => Project)
  @JoinColumn()
  project: Project;//项目

  @ManyToOne(() => Practice)
  @JoinColumn()
  practice: Practice;//对抗练习
  
  @ManyToOne(() => Course)
  @JoinColumn()
  course: Course;

  // @ManyToOne(()=>CourseScoreRatio)
  // @JoinColumn()
  // courseScoreRatio:CourseScoreRatio
}
