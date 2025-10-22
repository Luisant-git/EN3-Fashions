export class CreateCouponDto {
  code: string;
  type: string;
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  perUserLimit?: number;
  isActive?: boolean;
  expiryDate?: Date;
  specificUserId?: number;
}
