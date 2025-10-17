import { IsString, IsObject, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ShippingAddressDto {
  @IsString()
  fullName: string;

  @IsString()
  addressLine1: string;

  @IsString()
  addressLine2?: string;

  @IsString()
  city: string;

  @IsString()
  pincode: string;

  @IsString()
  mobile: string;
}

export class CreateOrderDto {
  @IsString()
  subtotal: string;

  @IsString()
  deliveryFee: string;

  @IsString()
  total: string;

  @IsString()
  paymentMethod: string;

  @IsObject()
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;

  @IsObject()
  deliveryOption: any;
}