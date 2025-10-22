import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCouponDto } from './dto/create-coupon.dto';

@Injectable()
export class CouponService {
  constructor(private prisma: PrismaService) {}

  async create(createCouponDto: CreateCouponDto) {
    return this.prisma.coupon.create({
      data: {
        ...createCouponDto,
        code: createCouponDto.code.toUpperCase(),
      },
    });
  }

  async findAll() {
    return this.prisma.coupon.findMany({
      include: { usages: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.coupon.findUnique({
      where: { id },
      include: { usages: true },
    });
  }

  async update(id: number, updateData: Partial<CreateCouponDto>) {
    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase();
    }
    return this.prisma.coupon.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number) {
    return this.prisma.coupon.delete({ where: { id } });
  }

  async validateCoupon(code: string, userId: number, orderAmount: number) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
      include: { usages: { where: { userId } } },
    });

    if (!coupon) {
      throw new BadRequestException('Invalid coupon code');
    }

    if (!coupon.isActive) {
      throw new BadRequestException('Coupon is inactive');
    }

    if (coupon.expiryDate && new Date() > coupon.expiryDate) {
      throw new BadRequestException('Coupon has expired');
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      throw new BadRequestException('Coupon usage limit reached');
    }

    if (coupon.usages.length >= coupon.perUserLimit) {
      throw new BadRequestException('You have already used this coupon');
    }

    if (orderAmount < coupon.minOrderAmount) {
      throw new BadRequestException(`Minimum order amount is ₹${coupon.minOrderAmount}`);
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (orderAmount * coupon.value) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.value;
    }

    return { coupon, discount };
  }

  async applyCoupon(couponId: number, userId: number) {
    await this.prisma.$transaction([
      this.prisma.couponUsage.create({
        data: { userId, couponId },
      }),
      this.prisma.coupon.update({
        where: { id: couponId },
        data: { usageCount: { increment: 1 } },
      }),
    ]);
  }

  async getActiveCoupons() {
    const coupons = await this.prisma.coupon.findMany({
      where: {
        isActive: true,
        OR: [
          { expiryDate: null },
          { expiryDate: { gte: new Date() } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    return coupons.map(coupon => ({
      id: coupon.id,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minOrderAmount: coupon.minOrderAmount,
      maxDiscount: coupon.maxDiscount,
    }));
  }
}
