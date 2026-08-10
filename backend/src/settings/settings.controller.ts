import { Controller, Get, Put, Body } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  getSettings() {
    return this.settingsService.getSettings();
  }

  @Put()
  updateSettings(@Body() body: {
    signatureUrl?: string,
    codShippingCharge?: number,
    maintenanceMode?: boolean,
    hiddenPages?: any,
    freeShippingThreshold?: number,
    freeShippingCodThreshold?: number,
    freeShippingDeliveryFee?: boolean,
    freeShippingCodFee?: boolean
  }) {
    return this.settingsService.updateSettings(
      body.signatureUrl,
      body.codShippingCharge,
      body.maintenanceMode,
      body.hiddenPages,
      body.freeShippingThreshold,
      body.freeShippingCodThreshold,
      body.freeShippingDeliveryFee,
      body.freeShippingCodFee
    );
  }
}
