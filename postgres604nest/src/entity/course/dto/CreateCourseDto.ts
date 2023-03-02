import { Type } from "class-transformer";
import {
    isArray,
    ValidateNested,
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsString,
    Length,
    isNumber,
    IsNumberString,
    IsInt,
    IsOptional, IsIn, IsArray
} from "class-validator";
//import 

export class CreateCourseDto{
    @IsNotEmpty()
    @IsString()
    name: string;//课程名称

    @IsOptional()
    @IsNumber() //校验

    //* 通过本文件上方的import语句可以看到，Type来自class-transform而不是validator。
    //* 他的作用是吧网络请求的字符串变成数字，而校验是validator干的事情
    @Type(() => Number)
    creatorId:number;//创建者id

    @IsNotEmpty()
    //结合使用，自动把http请求中的字符串变成数字
    @IsArray()
    @Type(() => Number)

    teachers:number[];//任课教师（可能有多个）
}
//这里先不用class-validator,还没搞懂
