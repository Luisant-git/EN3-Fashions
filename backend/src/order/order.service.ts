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
    const orderStatus = createOrderDto.paymentMethod === 'online' ? 'Pending' : 'Placed';
 
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
            sizeVariantId: item.sizeVariantId,
            quantity: item.quantity,
            type: item.type,
            bundleItems: item.bundleItems ? JSON.parse(JSON.stringify(item.bundleItems)) : undefined,
            hsnCode: item.hsnCode
          }))
        }
      },
      include: { items: true }
    });
 
    // Clear cart only for COD orders (Placed status)
    // For online payments (Pending status), cart will be cleared after payment verification
    if (orderStatus === 'Placed') {
      await this.prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      });
      // Send WhatsApp confirmation only for COD orders
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
   
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: { items: true }
    });

    // If payment successful, clear cart and send WhatsApp
    if (status === 'Placed') {
      // Clear user's cart
      const cart = await this.prisma.cart.findUnique({
        where: { userId: order.userId }
      });
      if (cart) {
        await this.prisma.cartItem.deleteMany({
          where: { cartId: cart.id }
        });
      }
      // Send WhatsApp confirmation
      await this.whatsappService.sendOrderConfirmation(order);
    }
 
    // Send WhatsApp notification based on status
    if (status === 'Shipped') {
      const trackingInfo = {
        courier: courierName || 'N/A',
        trackingId: trackingId || 'N/A',
        trackingUrl: trackingLink || 'N/A'
      };
      const invoiceFilename = `invoice-${order.id}.pdf`;
      await this.whatsappService.sendOrderShipped(order, trackingInfo, invoiceFilename);
    } else if (status === 'Delivered') {
      const invoiceFilename = `invoice-${order.id}.pdf`;
      await this.whatsappService.sendOrderDelivered(order, invoiceFilename);
    }
 
    return order;
  }

  async cleanupOldPendingOrders() {
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    
    const result = await this.prisma.order.updateMany({
      where: {
        status: 'Pending',
        createdAt: { lt: twoMinutesAgo }
      },
      data: { status: 'Abandoned' }
    });

    if (result.count > 0) {
      console.log(`Cleaned up ${result.count} old pending orders`);
    }
    
    return result.count;
  }
}