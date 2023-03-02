import { Injectable } from "@nestjs/common";
import { Users } from "../entity/user/users";
import { MailerService } from "@nestjs-modules/mailer";
import { relative } from "path";
import env from "../env";

const { Client } = require("node-scp");

@Injectable()
export class FileService {
  constructor(private mailerService: MailerService) {
  }

  async sendFileToServer(filePath) {
    if (env.NODE_ENV === "development") {

      return Client({
        host: "47.105.188.12",
        port: 22,
        username: "root",
        password: "Centos666"
        // privateKey: fs.readFileSync('./key.pem'),
        // passphrase: 'your key passphrase',
      }).then(client =>
        client.uploadFile(filePath, filePath)
          .then(response => {
           return  client.close(); // remember to close connection after you finish
          })
      ).catch(e => console.error(e));
    }else{
      return Promise.resolve();
    }
  }
}
