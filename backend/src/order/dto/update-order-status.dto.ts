import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderStatusDto {
  @ApiProperty({ example: 'Processing', enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] })
  @IsString()
  status: string;
}
