import { ExecutionContext, Injectable, createParamDecorator, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

}
// @Injectable()
// export class GqlAuthGuard extends AuthGuard('jwt') {
//   getRequest(context: ExecutionContext) {
//     const { req,  } = context.getContext();
//     // Logger.verbose(connection?.context)
//     // Logger.verbose(req?.headers)
//     //看请求里面存不存在connection的context,如果没有就是正常请求
//     // 如果有 就是 subscription authguard(AppModule里面 onConnect 挂上来的)
//     //* 特别要注意 这里如果返回 connection.context,那么由于Graphql Module的配置 passport
//     //* jwt会把user挂在connection.context上,而不是req上.
//
//     return   req;
//   }
// }


export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    return  context.switchToHttp().getRequest<Request>()['user']//普通http
  },
);
