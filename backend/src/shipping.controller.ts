import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common'

let shippingRules = [
  { id: 1, state: 'Maharashtra', flatShippingRate: 50 },
  { id: 2, state: 'Karnataka', flatShippingRate: 60 },
  { id: 3, state: 'Tamil Nadu', flatShippingRate: 55 }
]

@Controller('shipping')
export class ShippingController {
  @Get()
  findAll() {
    return shippingRules
  }

  @Post()
  create(@Body() createShippingDto: { state: string; flatShippingRate: number }) {
    const newRule = {
      id: Date.now(),
      state: createShippingDto.state,
      flatShippingRate: parseFloat(createShippingDto.flatShippingRate.toString())
    }
    shippingRules.push(newRule)
    return newRule
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateShippingDto: { state: string; flatShippingRate: number }) {
    const index = shippingRules.findIndex(rule => rule.id === +id)
    if (index !== -1) {
      shippingRules[index] = {
        ...shippingRules[index],
        state: updateShippingDto.state,
        flatShippingRate: parseFloat(updateShippingDto.flatShippingRate.toString())
      }
      return shippingRules[index]
    }
    return { message: 'Shipping rule not found' }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    shippingRules = shippingRules.filter(rule => rule.id !== +id)
    return { message: 'Shipping rule deleted' }
  }
}