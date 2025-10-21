import { IsString, IsObject, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ShippingAddressDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: '123 Main Street' })
  @IsString()
  addressLine1: string;

  @ApiProperty({ example: 'Apt 4B', required: false })
  @IsString()
  addressLine2?: string;

  @ApiProperty({ example: 'Mumbai' })
  @IsString()
  city: string;

  @ApiProperty({ example: '400001' })
  @IsString()
  pincode: string;

  @ApiProperty({ example: '9876543210' })
  @IsString()
  mobile: string;
}

export class CreateOrderDto {
  @ApiProperty({ example: '1497.00' })
  @IsString()
  subtotal: string;

  @ApiProperty({ example: '50.00' })
  @IsString()
  deliveryFee: string;

  @ApiProperty({ example: '1547.00' })
  @IsString()
  total: string;

  @ApiProperty({ example: 'card', enum: ['card', 'upi', 'cod'] })
  @IsString()
  paymentMethod: string;

  @ApiProperty({ type: ShippingAddressDto })
  @IsObject()
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;

  @ApiProperty({ example: { fee: 50, name: 'Standard Delivery', duration: '3-5 days' } })
  @IsObject()
  deliveryOption: any;
}