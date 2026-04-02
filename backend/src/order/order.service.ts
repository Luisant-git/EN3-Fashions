import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CouponService } from '../coupon/coupon.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { PaymentService } from './payment.service';
 
@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private couponService: CouponService,
    private whatsappService: WhatsappService,
    private paymentService: PaymentService
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

    // Final stock validation before order creation
    await this.validateItemsStock(cart.items);
 
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

    // Validate COD if selected
    if (createOrderDto.paymentMethod === 'cod') {
      const pincode = await this.prisma.pincode.findUnique({
        where: { pincode: createOrderDto.shippingAddress.pincode }
      });
      
      if (pincode && pincode.codAvailable === false) {
        throw new Error('Cash on Delivery is not available for this pincode');
      }
    }
  
    // Determine order status
    const orderStatus = createOrderDto.paymentMethod === 'online' ? 'Pending' : 'Placed';
 
    // Create Razorpay order for online payments
    let razorpayOrderId: string | null = null;
    if (createOrderDto.paymentMethod === 'online') {
      const razorpayOrder = await this.paymentService.createOrder(parseFloat(createOrderDto.total));
      razorpayOrderId = razorpayOrder.id;
    }

    // Update user's shipping address (excluding mobile number)
    const shippingAddressToSave = {
      name: createOrderDto.shippingAddress.fullName,
      addressLine: createOrderDto.shippingAddress.addressLine1,
      addressLine2: createOrderDto.shippingAddress.addressLine2,
      landmark: createOrderDto.shippingAddress.landmark,
      city: createOrderDto.shippingAddress.city,
      state: createOrderDto.shippingAddress.state,
      pincode: createOrderDto.shippingAddress.pincode
      // Note: mobile number is excluded from profile update
    };

    // Update user's profile with new shipping address
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        shippingAddress: shippingAddressToSave
      }
    });

    // Create order with items
    const order = await this.prisma.order.create({
      data: {
        userId,
        status: orderStatus,
        subtotal: createOrderDto.subtotal,
        deliveryFee: createOrderDto.deliveryFee,
        codFee: createOrderDto.codFee || '0',
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
      } as any,
      include: { items: true }
    });
 
    // Clear cart only for COD orders (Placed status)
    // For online payments (Pending status), cart will be cleared after payment verification
    if (orderStatus === 'Placed') {
      await this.prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      });
      
      // Deduct stock for COD orders
      await this.deductStock((order as any).items);
      
      // Send WhatsApp confirmation only for COD orders
      await this.whatsappService.sendOrderConfirmation(order);
    }
 
    // Return order with Razorpay order ID for online payments
    return {
      ...order,
      razorpayOrderId
    };
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
 
  async updateOrderStatus(orderId: number, status?: string, invoiceUrl?: string, packageSlipUrl?: string, courierName?: string, trackingId?: string, trackingLink?: string) {
    const updateData: any = {};
    if (status) updateData.status = status;
    if (invoiceUrl) updateData.invoiceUrl = invoiceUrl;
    if (packageSlipUrl) updateData.packageSlipUrl = packageSlipUrl;
    if (courierName && courierName !== "not provided") updateData.courierName = courierName;
    if (trackingId && trackingId !== "not provided") updateData.trackingId = trackingId;
    if (trackingLink && trackingLink !== "not provided") updateData.trackingLink = trackingLink;
   
    const existingOrder = await this.prisma.order.findUnique({
      where: { id: orderId }
    });

    const protectedStatuses = ['Placed', 'Accepted', 'Shipped', 'Delivered', 'Cancelled'];
    if (status === 'Abandoned' && existingOrder && protectedStatuses.includes(existingOrder.status)) {
      console.log(`Prevented marking a ${existingOrder.status} order (${orderId}) as Abandoned`);
      // Even if we don't update status, we should still update other fields if provided
      if (Object.keys(updateData).length > 1) {
        delete updateData.status;
      } else {
        return existingOrder;
      }
    }

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

      // Deduct stock for online orders (after payment verification)
      if (existingOrder?.status !== 'Placed') {
        await this.deductStock((order as any).items);
      }

      // Send WhatsApp confirmation
      await this.whatsappService.sendOrderConfirmation(order);
    }
 
    // Send WhatsApp notification based on status
    if (status === 'Accepted') {
      await this.whatsappService.sendOrderAccepted(order);
    } else if (status === 'Shipped') {
      const trackingInfo = {
        courier: courierName || order.courierName || 'N/A',
        trackingId: trackingId || order.trackingId || 'N/A',
        trackingUrl: trackingLink || order.trackingLink || 'N/A'
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
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    
    const result = await this.prisma.order.updateMany({
      where: {
        status: 'Pending',
        createdAt: { lt: thirtyMinutesAgo }
      },
      data: { status: 'Abandoned' }
    });

    if (result.count > 0) {
      console.log(`Cleaned up ${result.count} old pending orders`);
    }
    
    return result.count;
  }

  private async validateItemsStock(items: any[]) {
    for (const item of items) {
      if (!item.productId) continue;
      const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
      if (!product || !product.colors) continue;

      const colors = product.colors as any[];
      
      if (item.type === 'bundle' && item.bundleItems) {
        for (const bItem of (item.bundleItems as any[])) {
          const color = colors.find(c => c.name === bItem.color);
          const size = color?.sizes.find(s => s.size === bItem.size);
          const avail = parseInt(size?.quantity || '0');
          if (avail < 1) {
            throw new BadRequestException(`Item ${product.name} (${bItem.color} - ${bItem.size}) is now sold out.`);
          }
        }
      } else {
        const color = colors.find(c => c.name === item.color);
        const size = color?.sizes.find(s => s.size === item.size);
        const avail = parseInt(size?.quantity || '0');
        const req = item.quantity || 1;
        if (avail < req) {
          throw new BadRequestException(`Only ${avail} units left for ${product.name} (${item.color} - ${item.size}).`);
        }
      }
    }
  }

  private async deductStock(orderItems: any[]) {
    for (const item of orderItems) {
      if (!item.productId) continue;
      
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId }
      });
      
      if (!product || !product.colors) continue;
      
      let colors = product.colors as any[];
      
      if (item.type === 'bundle' && item.bundleItems) {
        // Handle Bundles
        const bundleItems = item.bundleItems as any[];
        bundleItems.forEach(bItem => {
          colors = colors.map(color => {
            if (color.name === bItem.color) {
              const updatedSizes = color.sizes.map(size => {
                if (size.size === bItem.size) {
                  const currentQty = parseInt(size.quantity || '0');
                  const deductQty = 1; // Each item in bundle counts as 1
                  return {
                    ...size,
                    quantity: Math.max(0, currentQty - deductQty).toString()
                  };
                }
                return size;
              });
              return { ...color, sizes: updatedSizes };
            }
            return color;
          });
        });
      } else {
        // Handle Single Items
        colors = colors.map(color => {
          if (color.name === item.color) {
            const updatedSizes = color.sizes.map(size => {
              if (size.size === item.size) {
                const currentQty = parseInt(size.quantity || '0');
                const deductQty = parseInt(item.quantity || '1');
                return {
                  ...size,
                  quantity: Math.max(0, currentQty - deductQty).toString()
                };
              }
              return size;
            });
            return { ...color, sizes: updatedSizes };
          }
          return color;
        });
      }
      
      await this.prisma.product.update({
        where: { id: item.productId },
        data: { colors }
      });
    }
  }
}