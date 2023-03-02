import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "../project/project";
import { Users } from "../user/users";

@Entity()
export class Homework {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ default:'' })
  name:string
  @Column({ default:'' })
  url:string
  @Column({ default:false })
  isSubmit:boolean
  @Column({ default:false })
  isGrade:boolean
  @ManyToOne(()=>Users)
  creator:Users;

  @ManyToOne(()=>Project)
  project: Project;
  @Column({ type: "timestamptz", default: new Date() }) // Recommended,with timezone
  createdTime: Date;
}
