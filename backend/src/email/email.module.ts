import { Module, Global } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailControlService } from './email-control.service';

@Global()
@Module({
  providers: [EmailService, EmailControlService],
  exports: [EmailService, EmailControlService],
})
export class EmailModule {}
