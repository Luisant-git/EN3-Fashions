import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderStatusDto {
  @ApiProperty({ example: 'Processing', enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] })
  @IsString()
  status: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  invoiceUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  packageSlipUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  courierName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  trackingId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  trackingLink?: string;
}
