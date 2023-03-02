import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { relative } from "path";
import { networkInterfaces } from "os";
import { FileService } from "./file.service";

@Controller("upload")
export class FileController {
  constructor(private fileService: FileService) {
  }

  /**
   * @api {post} /upload 上传图片
   * @apiVersion 0.9.1
   * @apiName PutUser
   * @apiGroup 文件
   * @apiPermission 用户
   *
   * @apiDescription 上传静态图片到服务器,会生成一个url返回.
   *
   * @apiParam {File} file 上传的文件
   *

   * @apiExample {js} JavaScript example
   * axios.post(root+'/upload',{file:readFileSync('myPicture.jpg')})
   *
   * @apiSuccess {String} string 静态资源在服务器的url
   * @apiSuccessExample {json} Success-Example
   *     HTTP/1.1 200
   *
   *     https://www.upperbunkbro.com/api/upload/4126df53fdfa1860b8c0b75fea6504bb
   *
   * @apiError (500 Internal Server Error)  InternalServerError 服务器出错,联系管理员
   *
   */
  @Post("/")
  @UseInterceptors(FileInterceptor("file"))
  uploadFile(@UploadedFile() file) {
    console.dir(file);
    // return this.fileService.sendFileToServer(file.path).then(
    //   () => `http://47.105.188.12:3000` + `/upload/${relative(file.destination || file.dest, file.path)}`
    // );
  return `http://localhost:3000` + `/upload/${relative(file.destination || file.dest, file.path)}`
  }
}
