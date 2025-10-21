import { Injectable } from '@nestjs/common';
import axios from 'axios';
 
@Injectable()
export class WhatsAppService {
  private readonly phoneNumberId = '803957376127788';
  private readonly token = 'EAAcMSpblosgBPTKtrvvphW8d8LeaTmookQekua5EzRtuMdOXZC7C7PMZCjeK740u6AaquUYUf7JBtFa0h0y8dXnCdShKlCkG9otefSx1xGNCOG1aCZBIzNI5STmlMYuFu9LrWRIPZCXSQDvdQxrp0V4dJRYuIylhas1VO14OZAbYHzAgrH2WjhqcJcPNSWwOyEwZDZD';
 
  async sendOtp(phone: string, otp: string): Promise<boolean> {
    try {
      const response = await axios.post(
        `https://graph.facebook.com/v21.0/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: phone,
          type: 'template',
          template: {
            name: 'viha_login_otp',
            language: { code: 'en' },
            components: [
              {
                type: 'body',
                parameters: [{ type: 'text', text: otp }]
              },
              {
                type: 'button',
                sub_type: 'url',
                index: '0',
                parameters: [{ type: 'text', text: otp }]
              }
            ]
          }
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('WhatsApp API Success:', response.data);
      return true;
    } catch (error) {
      console.error('WhatsApp API Error:', JSON.stringify(error.response?.data || error.message, null, 2));
      return false;
    }
  }
}