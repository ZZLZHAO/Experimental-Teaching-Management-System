import { Injectable } from '@nestjs/common';
import { Users } from "../entity/user/users";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}
  async sendUserConfirmation(user:Users,email: string, token: string) {
    const url = `http://127.0.0.1:8080/auth?token=${token}`;

    await this.mailerService.sendMail({
      to: email,

      // from: '"Support Team" <support@example.com>', // override default from
      subject: '欢迎来到TJ实验教学系统，请点击链接完成验证 ',
      template: './output', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        name:user.jobNumber,
        url:url,
      },
    });
  }

  async sendValidate(email:string,code:string){
    await this.mailerService.sendMail({
      to: email,

      // from: '"Support Team" <support@example.com>', // override default from
      subject: '邮箱验证码',
      // template: './output', // `.hbs` extension is appended automatically
      // context: { // ✏️ filling curly brackets with content
      //   name:123456,
      //   url:'123456',
      //   code:123456
      // },
      html: code
    });
  }
}
