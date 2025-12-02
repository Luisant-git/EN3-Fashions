import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common'
import { PrismaService } from './prisma.service'

@Controller('shipping')
export class ShippingController {
  constructor(private prisma: PrismaService) {}

  @Get()
  findAll() {
    return this.prisma.shippingRule.findMany()
  }

  @Post()
  create(@Body() createShippingDto: { state: string; flatShippingRate: number }) {
    return this.prisma.shippingRule.create({
      data: {
        state: createShippingDto.state,
        flatShippingRate: createShippingDto.flatShippingRate
      }
    })
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateShippingDto: { state: string; flatShippingRate: number }) {
    return this.prisma.shippingRule.update({
      where: { id: +id },
      data: {
        state: updateShippingDto.state,
        flatShippingRate: updateShippingDto.flatShippingRate
      }
    })
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prisma.shippingRule.delete({
      where: { id: +id }
    })
  }
}