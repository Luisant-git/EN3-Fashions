import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-auth.guard';

@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Get('active')
  @UseGuards(OptionalJwtAuthGuard)
  getActiveCoupons(@Request() req) {
    const userId = req.user?.userId;
    return this.couponService.getActiveCoupons(userId);
  }

  @Post('validate')
  @UseGuards(JwtAuthGuard)
  validate(@Request() req, @Body() body: { code: string; orderAmount: number }) {
    return this.couponService.validateCoupon(body.code, req.user.userId, body.orderAmount);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponService.create(createCouponDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.couponService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.couponService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateData: Partial<CreateCouponDto>) {
    return this.couponService.update(+id, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.couponService.remove(+id);
  }
}
