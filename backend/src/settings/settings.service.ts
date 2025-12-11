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

  async updateSettings(signatureUrl: string) {
    const settings = await this.getSettings();
    return this.prisma.appSettings.update({
      where: { id: settings.id },
      data: { signatureUrl }
    });
  }
}
