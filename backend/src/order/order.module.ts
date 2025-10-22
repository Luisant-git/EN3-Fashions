import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaService } from '../prisma.service';
import { CouponModule } from '../coupon/coupon.module';

@Module({
  imports: [CouponModule],
  controllers: [OrderController],
  providers: [OrderService, PrismaService],
  exports: [OrderService]
})
export class OrderModule {}