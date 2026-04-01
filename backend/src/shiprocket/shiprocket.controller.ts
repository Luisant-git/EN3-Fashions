import { Controller, Post, Body, Headers, BadRequestException } from '@nestjs/common';
import { ShiprocketService } from './shiprocket.service';
import { OrderService } from '../order/order.service';

@Controller('webhook')
export class ShiprocketController {
  constructor(
    private readonly shiprocketService: ShiprocketService,
    private readonly orderService: OrderService
  ) {}

  @Post('create')
  async createShiprocketOrder(@Body() body: { orderId: number }) {
    return this.shiprocketService.createShiprocketOrder(body.orderId);
  }

  @Post('tracking-update')
  async handleWebhook(@Body() payload: any, @Headers('x-api-key') apiKey: string) {
    // Security check: verify the token set in Shiprocket dashboard
    if (apiKey !== 'mysecret123') {
      console.error('Unauthorized webhook attempt - invalid x-api-key');
      return { success: false, message: 'Unauthorized' };
    }

    // Shiprocket sends status updates to this endpoint
    console.log('=== SHIPROCKET WEBHOOK RECEIVED ===');
    console.log('Payload:', JSON.stringify(payload, null, 2));

    const { order_id, status, scourior_name, awb_code, tracking_url } = payload;

    if (!order_id) {
      console.error('Missing order_id in Shiprocket webhook');
      return { success: false, message: 'Missing order_id' };
    }

    const dbOrderId = parseInt(order_id);
    if (isNaN(dbOrderId)) {
      console.error('Invalid order_id in Shiprocket webhook:', order_id);
      return { success: false, message: 'Invalid order_id' };
    }

    let internalStatus: string | null = null;
    const shiprocketStatus = status.toUpperCase();

    // Mapping based on user request:
    // NEW -> Accepted
    // PICKED UP -> Accepted
    // IN TRANSIT -> Accepted
    // OUT FOR DELIVERY -> Accepted
    // DELIVERED -> Shipped
    // CANCELLED -> Cancelled
    // RTO (Return) -> Cancelled

    switch (shiprocketStatus) {
      case 'NEW':
      case 'PICKED UP':
      case 'IN TRANSIT':
      case 'OUT FOR DELIVERY':
        internalStatus = 'Accepted';
        break;
      case 'DELIVERED':
        internalStatus = 'Shipped'; // User specifically asked for Shipped here
        break;
      case 'CANCELED':
      case 'CANCELLED':
      case 'RTO (RETURN)':
      case 'RTO':
        internalStatus = 'Cancelled';
        break;
      default:
        console.log(`Shiprocket status ${shiprocketStatus} not mapped to any internal status`);
        // We still might want to update tracking info even if status doesn't change
        break;
    }

    try {
      if (internalStatus || scourior_name || awb_code || tracking_url) {
        await this.orderService.updateOrderStatus(
          dbOrderId,
          internalStatus || undefined,
          undefined, // invoiceUrl
          undefined, // packageSlipUrl
          scourior_name || undefined,
          awb_code || undefined,
          tracking_url || undefined
        );
        console.log(`Auto-updated order ${dbOrderId} based on Shiprocket status: ${shiprocketStatus}`);
      }
      return { success: true };
    } catch (error) {
      console.error('Failed to update order status via Shiprocket webhook:', error.message);
      return { success: false, error: error.message };
    }
  }
}
