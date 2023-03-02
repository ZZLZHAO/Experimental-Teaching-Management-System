import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "../user/users";
import { Course } from "../course/course";
import { Practice } from "./practice";

@Entity()
export class Problem{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default:'' })
  description:string;

  @Column({ default:0 })
  type:number;
  //0-> 单选 1->多选

  @Column({ default:'' })
  options:string

  @Column({ default:'' })
  answer:string

  @ManyToOne(()=>Practice)
  practice:Practice
}