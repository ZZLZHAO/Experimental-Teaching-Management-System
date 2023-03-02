import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "./project";
import { Users } from "../user/users";

@Entity()
export class ProjectFile {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ default:'' })
  name:string
  @Column({ default:'' })
  url:string
  @ManyToOne((type)=>Users, creator=>creator.uploadedFiles)
  creator:Users;

  @ManyToOne((type)=>Project, project=>project.files)
  project: Project;
  @Column({ type: "timestamptz", default: new Date() }) // Recommended,with timezone
  createdTime: Date;
}
