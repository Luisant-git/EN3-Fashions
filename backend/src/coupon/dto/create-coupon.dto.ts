import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCouponDto {
  @ApiProperty({ example: 'SAVE20', description: 'Coupon code' })
  code: string;

  @ApiProperty({ example: 'percentage', enum: ['percentage', 'fixed'], description: 'Discount type' })
  type: string;

  @ApiProperty({ example: 20, description: 'Discount value (percentage or fixed amount)' })
  value: number;

  @ApiPropertyOptional({ example: 500, description: 'Minimum order amount' })
  minOrderAmount?: number;

  @ApiPropertyOptional({ example: 1000, description: 'Maximum discount amount' })
  maxDiscount?: number;

  @ApiPropertyOptional({ example: 100, description: 'Total usage limit' })
  usageLimit?: number;

  @ApiPropertyOptional({ example: 1, description: 'Usage limit per user' })
  perUserLimit?: number;

  @ApiPropertyOptional({ example: true, description: 'Is coupon active' })
  isActive?: boolean;

  @ApiPropertyOptional({ example: '2025-12-31', description: 'Expiry date' })
  expiryDate?: Date;

  @ApiPropertyOptional({ example: 7, description: 'Specific user ID (for customer-specific coupons)' })
  specificUserId?: number;
}
