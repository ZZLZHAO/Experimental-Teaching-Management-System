import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "../user/users";
import { Notice } from "./notice";

@Entity()
export class NoticeFile {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ default:'' })
  name:string
  @Column({ default:'' })
  url:string
  @ManyToOne((type)=>Users, creator=>creator.uploadedFiles)
  creator:Users;
  @ManyToOne((type)=>Notice, n=>n.files)
  notice:Notice
  @Column({ type: "timestamptz", default: new Date() }) // Recommended,with timezone
  createdTime: Date;
}
