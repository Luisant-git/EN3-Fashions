import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    let settings = await this.prisma.appSettings.findFirst();
    if (!settings) {
      settings = await this.prisma.appSettings.create({ data: {} });
    }
    return settings;
  }

  async updateSettings(signatureUrl?: string, codShippingCharge?: number) {
    const settings = await this.getSettings();
    const updateData: any = {};
    if (signatureUrl !== undefined) updateData.signatureUrl = signatureUrl;
    if (codShippingCharge !== undefined) updateData.codShippingCharge = codShippingCharge;
    
    return this.prisma.appSettings.update({
      where: { id: settings.id },
      data: updateData
    });
  }
}
