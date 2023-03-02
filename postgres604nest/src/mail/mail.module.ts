import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRoot({
      // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
      // or
      transport: {
        host: 'smtp.163.com',
        service: 'smtp.163.com',
        port:'25',
        secureConnection: false,
        secure: false,
        auth: {
          user: '15216812016@163.com',
          pass: 'ZVAEQBQXCMXTSXZA',
        },
      },
      defaults: {
        from: '"No Reply" <15216812016@163.com>',
      },
      template: {
        dir: join(__dirname, './templates'),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService], // 👈 export for DI
})
export class MailModule {}
