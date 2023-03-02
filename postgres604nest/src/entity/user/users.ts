import { group } from "console";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable} from "typeorm";
import { Course } from "../course/course";
import { Group } from "../course/group";
import { Project } from "../project/project";
import { ProjectFile } from "../project/project-file";
import { Score } from "../score/score";
export enum UsersType {
  STUDENT='student',
  TEACHER='teacher',
  RESPONSIBLE_TEACHER='responsible_teacher',
  ADMIN ='admin',
}
export enum Gender {
  UNKNOWN = 'unknown',
  MALE='male',
  FEMALE ='female',
}
@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;//id

  practiceScore:Score;//只用于对抗练习记录分数，不用放入数据库

  @Column({default:''})
  email: string;//email
  @Column({default:''})
  enablingEmail:string
  @Column({default:''})
  name: string;//realname

  @Column({default:''})
  password: string;//密码
  
  @Column({default:''})
  enablingPassword:string
  
  @Column({default:''})
  subject: string;
  
  @Column({default:''})
  description: string;
  
  @Column({default:''})
  avatar: string;
  
  @Column({default:18})
  age: number;
  @Column({default:'1919190'})
  jobNumber: string;
  @Column({default:2019})
  grade: number;
  @Column({default:false})
  enabled: boolean;
  // @Column({ type: 'date' })
  // createdDate: string;
  //
  @Column({ type: 'timestamptz',default:new Date() }) // Recommended,with timezone
  createdTime: Date;
  @Column({
    type: "enum",
    enum: UsersType,
    default: UsersType.STUDENT
  })
  type:UsersType;//用户类型
  @Column({
    type: "enum",
    enum: Gender,
    default: Gender.UNKNOWN
  })
  gender:Gender;//用户类型

  @OneToMany(type => Course, course => course.creator)//这里的course只是参数名称
  createdCourses: Course[];//创建的课程->责任教师
  
  @OneToMany(type => ProjectFile, file => file.creator)//这里的course只是参数名称
  uploadedFiles: ProjectFile[];
  
  @OneToMany(type => Score, score => score.user)//这里的course只是参数名称
  scores:Score[]

  @ManyToMany(type=>Group, group=>group.users)
  groups:Group[]

  @ManyToMany(type=>Course,haha=>haha.students)//所以改成其他的也没有问题
  participatingCourses:Course[];//参与的课程->学生
  
  @ManyToMany(type=>Project,haha=>haha.participants)//所以改成其他的也没有问题
  participatingProjects: Project [];//参与的课程->学生，助教
  
  @ManyToMany(type=>Course,haha=>haha.students)//所以改成其他的也没有问题
    //jointable统一不放在users里面
    //或者统一放在user里面，反正要统一
  assistingCourses:Course[];//参与的课程->学生，助教

  @ManyToMany(type=>Course,course=>course.teachers)
  teachingCourses:Course[];//教授的课程->一般教师
}
