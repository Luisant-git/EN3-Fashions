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
    const messageId = message.id;
    const text = message.text?.body;
    const image = message.image;
    const video = message.video;
    const document = message.document;
    const audio = message.audio;

    let mediaType: string | null = null;
    let mediaUrl: string | null = null;

    if (image) {
      mediaType = 'image';
      mediaUrl = await this.downloadMedia(image.id);
    } else if (video) {
      mediaType = 'video';
      mediaUrl = await this.downloadMedia(video.id);
    } else if (document) {
      mediaType = 'document';
      mediaUrl = await this.downloadMedia(document.id);
    } else if (audio) {
      mediaType = 'audio';
      mediaUrl = await this.downloadMedia(audio.id);
    }

    await this.prisma.whatsappMessage.create({
      data: {
        messageId,
        from,
        to: this.phoneNumberId!,
        message: text || (mediaType ? `${mediaType} file` : null),
        mediaType,
        mediaUrl,
        direction: 'incoming',
        status: 'received'
      }
    });

    console.log(`Message from ${from}: ${text || mediaType}`);
  }

  async downloadMedia(mediaId: string): Promise<string | null> {
    try {
      console.log('Downloading media:', mediaId);
      
      const mediaInfoResponse = await axios.get(
        `${this.apiUrl}/${mediaId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );
      
      console.log('Media info:', mediaInfoResponse.data);
      const mediaUrl = mediaInfoResponse.data.url;
      
      if (!mediaUrl) {
        console.error('No media URL found');
        return null;
      }
      
      const mediaDataResponse = await axios.get(mediaUrl, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        },
        responseType: 'arraybuffer'
      });

      const fs = require('fs');
      const path = require('path');
      const crypto = require('crypto');
      
      const ext = mediaInfoResponse.data.mime_type?.split('/')[1] || 'jpg';
      const filename = `${crypto.randomBytes(16).toString('hex')}.${ext}`;
      const filepath = path.join('uploads', filename);
      
      fs.writeFileSync(filepath, mediaDataResponse.data);
      
      const finalUrl = `${process.env.UPLOAD_URL}/${filename}`;
      console.log('Media saved:', finalUrl);
      
      return finalUrl;
    } catch (error) {
      console.error('Media download error:', error.response?.data || error.message);
      return null;
    }
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
          from: this.phoneNumberId!,
          to,
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

  async sendMediaMessage(to: string, mediaUrl: string, mediaType: string, caption?: string) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          type: mediaType,
          [mediaType]: { link: mediaUrl, caption }
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
          from: this.phoneNumberId!,
          to,
          message: caption || `${mediaType} file`,
          mediaType,
          mediaUrl,
          direction: 'outgoing',
          status: 'sent'
        }
      });

      return { success: true, messageId: response.data.messages[0].id };
    } catch (error) {
      console.error('WhatsApp Media API Error:', error.response?.data || error.message);
      return { success: false, error: error.message };
    }
  }

  async updateMessageStatus(messageId: string, status: string) {
    try {
      await this.prisma.whatsappMessage.updateMany({
        where: { messageId },
        data: { status }
      });
      console.log(`Message ${messageId} status updated to ${status}`);
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  }

  async getMessages(phoneNumber?: string) {
    return this.prisma.whatsappMessage.findMany({
      where: phoneNumber ? {
        OR: [
          { from: phoneNumber },
          { to: phoneNumber }
        ]
      } : {},
      orderBy: { createdAt: 'asc' },
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
          from: this.phoneNumberId!,
          to: phoneNumber,
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
