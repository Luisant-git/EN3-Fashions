import { Controller, Post, Get, Body, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaymentService } from './payment.service';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new order with payment' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createOrder(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    // Create order with pending status first
    const order = await this.orderService.createOrder(req.user.userId, createOrderDto);
    
    // If payment method is online, create Razorpay order
    if (createOrderDto.paymentMethod === 'online') {
      const razorpayOrder = await this.paymentService.createOrder(
        parseFloat(createOrderDto.total),
        'INR',
        order.id.toString()
      );
      return { ...order, razorpayOrderId: razorpayOrder.id };
    }
    
    return order;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all orders for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserOrders(@Request() req) {
    return this.orderService.getUserOrders(req.user.userId);
  }

  @Get(':orderId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific order by ID' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async getOrderById(@Request() req, @Param('orderId') orderId: string) {
    return this.orderService.getOrderById(req.user.userId, parseInt(orderId));
  }

  @Get('admin/all')
  @ApiOperation({ summary: 'Get all orders (Admin)' })
  @ApiResponse({ status: 200, description: 'All orders retrieved successfully' })
  async getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @Patch(':orderId/status')
  @ApiOperation({ summary: 'Update order status (Admin)' })
  @ApiResponse({ status: 200, description: 'Order status updated successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async updateOrderStatus(@Param('orderId') orderId: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    return this.orderService.updateOrderStatus(
      parseInt(orderId), 
      updateOrderStatusDto.status, 
      updateOrderStatusDto.invoiceUrl, 
      updateOrderStatusDto.packageSlipUrl,
      updateOrderStatusDto.courierName,
      updateOrderStatusDto.trackingId,
      updateOrderStatusDto.trackingLink
    );
  }

  @Post('payment/create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Razorpay order (deprecated - use POST /orders instead)' })
  async createPaymentOrder(@Body() body: { amount: number }) {
    return this.paymentService.createOrder(body.amount);
  }

  @Post('payment/verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify Razorpay payment and update order' })
  async verifyPayment(
    @Request() req,
    @Body() body: { orderId: string; paymentId: string; signature: string; dbOrderId: number }
  ) {
    const isValid = this.paymentService.verifyPayment(body.orderId, body.paymentId, body.signature);
    
    if (isValid) {
      const paymentMethod = await this.paymentService.getPaymentMethod(body.paymentId);
      // Update order status to Placed after successful payment
      await this.orderService.updateOrderAfterPayment(
        body.dbOrderId,
        'Placed',
        paymentMethod,
        body.paymentId
      );
      return { success: true, paymentMethod };
    }
    
    // If payment failed, mark order as abandoned
    await this.orderService.updateOrderAfterPayment(
      body.dbOrderId,
      'Abandoned',
      'online',
      null
    );
    return { success: false };
  }
}