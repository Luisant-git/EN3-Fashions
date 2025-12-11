import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CouponService } from '../coupon/coupon.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private couponService: CouponService,
    private whatsappService: WhatsappService
  ) {}

  async createOrder(userId: number, createOrderDto: CreateOrderDto) {
    // Get user's cart
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: true }
    });

    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    // Apply coupon if provided
    let discount = '0';
    let couponCode: string | null = null;
    if (createOrderDto.couponCode) {
      try {
        const result = await this.couponService.validateCoupon(
          createOrderDto.couponCode,
          userId,
          parseFloat(createOrderDto.subtotal)
        );
        discount = result.discount.toString();
        couponCode = createOrderDto.couponCode;
        await this.couponService.applyCoupon(result.coupon.id, userId);
      } catch (error) {
        throw new Error('Invalid coupon: ' + error.message);
      }
    }

    // Determine order status
    const orderStatus = createOrderDto.paymentMethod === 'abandoned' ? 'Abandoned' : 'Placed';

    // Create order with items
    const order = await this.prisma.order.create({
      data: {
        userId,
        status: orderStatus,
        subtotal: createOrderDto.subtotal,
        deliveryFee: createOrderDto.deliveryFee,
        discount,
        couponCode,
        total: createOrderDto.total,
        paymentMethod: createOrderDto.paymentMethod,
        shippingAddress: JSON.parse(JSON.stringify(createOrderDto.shippingAddress)),
        deliveryOption: JSON.parse(JSON.stringify(createOrderDto.deliveryOption)),
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            imageUrl: item.imageUrl,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            type: item.type,
            bundleItems: item.bundleItems ? JSON.parse(JSON.stringify(item.bundleItems)) : undefined
          }))
        }
      },
      include: { items: true }
    });

    // Clear cart only if order is placed successfully (not abandoned)
    if (orderStatus !== 'Abandoned') {
      await this.prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      });
      // Send WhatsApp confirmation only for successful orders
      await this.whatsappService.sendOrderConfirmation(order);
    }

    return order;
  }

  async getUserOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getOrderById(userId: number, orderId: number) {
    return this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { items: true }
    });
  }

  async getAllOrders() {
    return this.prisma.order.findMany({
      include: { items: true, user: { select: { id: true, email: true, name: true, phone: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateOrderStatus(orderId: number, status: string, invoiceUrl?: string, packageSlipUrl?: string, courierName?: string, trackingId?: string, trackingLink?: string) {
    const updateData: any = { status };
    if (invoiceUrl) updateData.invoiceUrl = invoiceUrl;
    if (packageSlipUrl) updateData.packageSlipUrl = packageSlipUrl;
    if (courierName) updateData.courierName = courierName;
    if (trackingId) updateData.trackingId = trackingId;
    if (trackingLink) updateData.trackingLink = trackingLink;
    
    return this.prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: { items: true }
    });
  }
}