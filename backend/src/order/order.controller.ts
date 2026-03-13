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
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createOrder(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(req.user.userId, createOrderDto);
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
  @ApiOperation({ summary: 'Create Razorpay order' })
  async createPaymentOrder(@Body() body: { amount: number }) {
    return this.paymentService.createOrder(body.amount);
  }
 
  @Post('payment/verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify Razorpay payment' })
  async verifyPayment(@Request() req, @Body() body: any) {
    console.log('=== PAYMENT VERIFICATION STARTED ===');
    console.log('Raw request body:', req.body);
    console.log('Parsed body:', body);
    console.log('Body keys:', Object.keys(body));
    console.log('User ID:', req.user.userId);
    
    const { orderId, paymentId, signature, dbOrderId } = body;
    console.log('Extracted fields:');
    console.log('- orderId:', orderId);
    console.log('- paymentId:', paymentId);
    console.log('- signature:', signature);
    console.log('- dbOrderId:', dbOrderId);
    
    try {
      if (!orderId || !paymentId || !signature) {
        console.log('Missing required fields for signature verification');
        return { success: false, error: 'Missing payment verification data' };
      }
      
      const isValid = this.paymentService.verifyPayment(orderId, paymentId, signature);
      console.log('Payment signature valid:', isValid);
      
      if (isValid && dbOrderId) {
        console.log('Fetching order with ID:', dbOrderId);
        
        // Check if order exists
        const existingOrder = await this.orderService.getOrderById(req.user.userId, dbOrderId);
        
        if (!existingOrder) {
          console.log('Order not found for ID:', dbOrderId);
          return { success: false, error: 'Order not found' };
        }
        
        console.log(`Updating order ${dbOrderId} from ${existingOrder.status} to Placed`);
        
        // Update order status to Placed regardless of current status (Pending or Abandoned)
        await this.orderService.updateOrderStatus(dbOrderId, 'Placed');
        
        console.log('Order status updated successfully');
        
        // Cleanup old pending orders (instead of cron job)
        await this.orderService.cleanupOldPendingOrders();
        
        const paymentMethod = await this.paymentService.getPaymentMethod(paymentId);
        console.log('=== PAYMENT VERIFICATION SUCCESS ===');
        return { success: true, paymentMethod, orderStatus: 'Placed' };
      }
      
      console.log('Payment verification failed - invalid signature or missing dbOrderId');
      return { success: false, error: 'Payment verification failed' };
    } catch (error) {
      console.error('=== PAYMENT VERIFICATION ERROR ===');
      console.error('Error details:', error);
      return { success: false, error: 'Payment verification failed' };
    }
  }
}