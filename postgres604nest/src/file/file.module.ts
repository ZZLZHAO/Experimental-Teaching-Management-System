import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { join } from "path";
import { diskStorage } from 'multer';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FileService } from "./file.service";

@Module({
  imports:[ MulterModule.register({
    dest:'/upload',
    storage:diskStorage({
      destination:function(req,file,cb){
        cb(null, '/upload')
      },
      filename:function(req,file,cb){
        const suffix=Date.now()+'_'+Math.round(Math.random()*1E9)
        console.log( JSON.stringify(file) );
        const array=file.originalname.split('.')
        const filename=array[0]
        const suffixMime=array[1]
        cb(null,filename+'_'+suffix+'.'+suffixMime)
      }
    })
  }),
    ServeStaticModule.forRoot({
      rootPath: '/upload',
      serveRoot:'/upload',
      serveStaticOptions:{
        maxAge:99999999
      }
    }),
  ],
  providers:[FileService],
  controllers: [FileController]
})
export class FileModule {}
