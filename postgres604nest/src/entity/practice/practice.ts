import { Column, Entity, JoinColumn,JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "../user/users";
import { Course } from "../course/course";

@Entity()
export class Practice{
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ default:'' })
  name:string

  @Column({ default:false })
  marked:boolean

  submited:boolean//是否已经提交，不写在表里，取的时候判断

  @Column({ default:5 })
  timeLimit:number//时间限制，默认5分钟

  @ManyToOne(()=>Users)
  @JoinColumn()
  creator:Users;//创建者->责任教师

  @ManyToOne(()=>Course)
  @JoinColumn()
  course:Course


  @Column({ type: 'timestamptz',default:new Date() }) // Recommended,with timezone
  createdTime: Date;

  @Column({ type: 'timestamptz',nullable:false,default:new Date()  }) // Recommended,with timezone
  startTime: Date;

  @Column({ type: 'timestamptz',nullable:false ,default:new Date() }) // Recommended,with timezone
  endTime: Date;


}
