import { Controller, Post, Get, Body, Query, Req } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Get('webhook')
  verifyWebhook(@Query() query: any) {
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];

    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      console.log('Webhook verified');
      return parseInt(challenge);
    }
    return 'Forbidden';
  }

  @Post('webhook')
  async handleWebhook(@Body() body: any) {
    if (body.object === 'whatsapp_business_account') {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.field === 'messages') {
            const message = change.value.messages?.[0];
            if (message) {
              await this.whatsappService.handleIncomingMessage(message);
            }
          }
        }
      }
      return 'EVENT_RECEIVED';
    }
    return 'Not Found';
  }

  @Get('messages')
  async getMessages(@Query('phone') phone?: string) {
    return this.whatsappService.getMessages(phone);
  }

  @Post('send-message')
  async sendMessage(@Body() body: { to: string; message: string }) {
    return this.whatsappService.sendMessage(body.to, body.message);
  }
}
