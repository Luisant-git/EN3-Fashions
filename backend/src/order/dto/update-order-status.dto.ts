import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderStatusDto {
  @ApiProperty({ example: 'Processing', enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] })
  @IsString()
  status: string;

  @ApiProperty({ required: false, example: { courier: 'Blue Dart', trackingId: '1234', trackingUrl: 'https://tracking.bluedart.com/123456' } })
  @IsOptional()
  @IsObject()
  trackingInfo?: { courier: string; trackingId: string; trackingUrl: string };

  @ApiProperty({ required: false, example: 'https://en3fashion.api.luisant.cloud/uploads/invoice-11.pdf' })
  @IsOptional()
  @IsString()
  invoiceUrl?: string;
}
