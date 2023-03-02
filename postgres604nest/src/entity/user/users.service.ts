import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "./users";
import { Connection, Repository } from "typeorm";
import { CreateUserDto } from "./dto/CreateUserDto";
import { Course } from "../course/course";
import { AuthService } from "../../auth/auth.service";
import { MailService } from "../../mail/mail.service";
import { logger } from "handlebars";
import { use } from "passport";

// This should be a real class/interface representing a user entity

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    private connection: Connection,
    private mailService: MailService

  ) {}

  findAll(): Promise<Users[]> {
    return this.usersRepository.find();
  }

  async updatePsw(user:Users,password:string){
    user.password=password;
    user.enablingPassword=password;
    return this.usersRepository.update(user.id,user);
  }
  
  async create(createUserDto: CreateUserDto): Promise<Users> {
    const user = new Users();
    user.jobNumber = createUserDto.jobNumber;
    user.name = createUserDto.realName;

    //!暂时写在这里
    // const course =new Course()
    // course.name="微积分"
    //*以下两者任选其一即可在数据库中形成正确的一对多关系
    //这里使用2方法
    //注意 被引用的(例如1中的user,2中的course)需要先被save
    //注意 不能同时写1和2,会形成循环依赖
    // course.responsibleTeacher=user//1
    // await this.courseRepository.save(course)
    // user.createdCourses=[course]//2
    return this.usersRepository.save(user);
  }

  async createMany(users: Users[]) {
    await this.connection.transaction(async manager => {
      await manager.save(users[0]);
      await manager.save(users[1]);
    });
  }

  findById(id: number): Promise<Users> {
    return this.usersRepository.findOne(id);
  }

  findByEmail(email: string): Promise<Users> {
    return this.usersRepository.findOne({
      where: {
        email: email
      },
      relations:['createdCourses','participatingCourses','teachingCourses']
    });
  }
  findByJobNumber(jobNumber: string): Promise<Users> {
    return this.usersRepository.findOne({
      where: {
        jobNumber: jobNumber
      },
    });
  }
  updateUser(user): Promise<Users> {
    return this.usersRepository.save(user)
  }
  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async update(userId:number,avatar:string,description:string){
    let user=await this.usersRepository.findOne({
      where:{id:userId}
    })
    user.avatar=avatar;
    user.description=description;
    return this.usersRepository.save(user)
  }


}
