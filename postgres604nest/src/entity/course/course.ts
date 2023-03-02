import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, ManyToMany ,JoinTable} from "typeorm";
import { Users } from "../user/users";
import { Project } from "../project/project";
// import { CourseScoreRatio } from "./course-score-ratio";

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default:''})
  name:string;//课程名称

  @ManyToOne((type)=>Users, creator=>creator.createdCourses)
  creator:Users;//创建者->责任教师

  @OneToMany(()=>Project,project=>project.course)
  projects:Project[]
  
  @ManyToMany((type)=>Users,user=>user.participatingCourses,{cascade:false})
  @JoinTable()
  students:Users[];//参与者->学生

  @ManyToMany((type)=>Users,user=>user.assistingCourses,{cascade:false},)
  assistants:Users[];//参与者->助教
  
  @ManyToMany((type)=>Users,user=>user.teachingCourses,{cascade:false})
  @JoinTable()
  teachers:Users[];//这门课的授课教师->一般教师

  @Column({default:true})
  isCourseOpen: boolean;
  //开放时间，结束时间等等
  @Column({ type: 'timestamptz',default:new Date() }) // Recommended,with timezone
  createdTime: Date;

  @Column({ type: 'timestamptz',nullable:false }) // Recommended,with timezone
  startTime: Date;

  @Column({ type: 'timestamptz',nullable:false }) // Recommended,with timezone
  endTime: Date;

  // @OneToMany(_=>CourseScoreRatio, csr=>csr.course)
  // courseScoreRatios:CourseScoreRatio[]

  @Column("float",{ default: 0 })
  usualRatio: Number;//平时成绩占比

  @Column("float",{ default: 0 })
  projectRatio: Number;//项目占比


  @Column("float",{ default: 0 })
  practiceRatio: Number;//对抗练习占比


}
