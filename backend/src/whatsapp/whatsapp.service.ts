import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma.service';

@Injectable()
export class WhatsappService {
  private readonly apiUrl = process.env.WHATSAPP_API_URL;
  private readonly phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  private readonly accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  constructor(private prisma: PrismaService) {}

  async handleIncomingMessage(message: any) {
    const from = message.from;
    const text = message.text?.body;
    const messageId = message.id;

    if (!text) return;

    await this.prisma.whatsappMessage.create({
      data: {
        messageId,
        from,
        message: text,
        direction: 'incoming',
        status: 'received'
      }
    });

    console.log(`Message from ${from}: ${text}`);
  }

  async sendMessage(to: string, message: string) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body: message }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      await this.prisma.whatsappMessage.create({
        data: {
          messageId: response.data.messages[0].id,
          from: to,
          message,
          direction: 'outgoing',
          status: 'sent'
        }
      });

      return { success: true, messageId: response.data.messages[0].id };
    } catch (error) {
      console.error('WhatsApp API Error:', error.response?.data || error.message);
      return { success: false, error: error.message };
    }
  }

  async getMessages(phoneNumber?: string) {
    return this.prisma.whatsappMessage.findMany({
      where: phoneNumber ? { from: phoneNumber } : {},
      orderBy: { createdAt: 'desc' },
      take: 100
    });
  }

  async sendOrderConfirmation(order: any) {
    const phoneNumber = order.shippingAddress.mobile;
    const name = order.shippingAddress.fullName;

    try {
      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: phoneNumber,
          type: 'template',
          template: {
            name: 'order_received_v1',
            language: { code: 'en' },
            components: [
              {
                type: 'body',
                parameters: [
                  { type: 'text', text: name },
                  { type: 'text', text: order.id.toString() },
                  { type: 'text', text: order.total }
                ]
              }
            ]
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      await this.prisma.whatsappMessage.create({
        data: {
          messageId: response.data.messages[0].id,
          from: phoneNumber,
          message: `Order ${order.id} confirmation sent`,
          direction: 'outgoing',
          status: 'sent'
        }
      });

      console.log(`WhatsApp message sent to ${phoneNumber}:`, response.data);
      return { success: true, messageId: response.data.messages[0].id };
    } catch (error) {
      console.error('WhatsApp API Error:', error.response?.data || error.message);
      return { success: false, error: error.message };
    }
  }
}
