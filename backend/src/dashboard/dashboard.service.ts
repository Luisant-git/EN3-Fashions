import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    // Current period stats
    const currentOrders = await this.prisma.order.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } }
    });

    // Previous period stats for comparison
    const previousOrders = await this.prisma.order.findMany({
      where: { 
        createdAt: { 
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo 
        } 
      }
    });

    const currentRevenue = currentOrders.reduce((sum, order) => sum + parseFloat(order.total), 0);
    const previousRevenue = previousOrders.reduce((sum, order) => sum + parseFloat(order.total), 0);
    const revenueChange = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue * 100).toFixed(0) : '0';

    const currentOrderCount = currentOrders.length;
    const previousOrderCount = previousOrders.length;
    const orderChange = previousOrderCount > 0 ? ((currentOrderCount - previousOrderCount) / previousOrderCount * 100).toFixed(0) : '0';

    const currentCustomers = await this.prisma.user.count({
      where: { createdAt: { gte: thirtyDaysAgo } }
    });
    const previousCustomers = await this.prisma.user.count({
      where: { 
        createdAt: { 
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo 
        } 
      }
    });
    const customerChange = previousCustomers > 0 ? ((currentCustomers - previousCustomers) / previousCustomers * 100).toFixed(0) : '0';

    const pendingDelivery = await this.prisma.order.count({
      where: { status: { in: ['pending', 'processing'] } }
    });

    return {
      totalRevenue: {
        value: `₹${currentRevenue.toFixed(0)}`,
        change: `${Math.abs(parseInt(revenueChange))}%`,
        trend: parseInt(revenueChange) >= 0 ? 'up' : 'down'
      },
      totalOrder: {
        value: currentOrderCount.toString(),
        change: `${Math.abs(parseInt(orderChange))}%`,
        trend: parseInt(orderChange) >= 0 ? 'up' : 'down'
      },
      totalCustomer: {
        value: currentCustomers.toString(),
        change: `${Math.abs(parseInt(customerChange))}%`,
        trend: parseInt(customerChange) >= 0 ? 'up' : 'down'
      },
      pendingDelivery: {
        value: pendingDelivery.toString(),
        change: '5%',
        trend: 'up'
      }
    };
  }

  async getSalesAnalytics() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    const salesData = await Promise.all(
      months.map(async (month, index) => {
        const startDate = new Date(currentYear, index, 1);
        const endDate = new Date(currentYear, index + 1, 0);
        
        const orders = await this.prisma.order.findMany({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          }
        });
        
        const sales = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
        return { month, sales: Math.round(sales) };
      })
    );

    return salesData;
  }

  async getTopSellingProducts() {
    const products = await this.prisma.orderItem.groupBy({
      by: ['productId', 'name', 'imageUrl'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
      where: { productId: { not: null } }
    });

    return products.map(p => ({
      id: p.productId,
      name: p.name,
      image: p.imageUrl,
      sold: p._sum.quantity
    }));
  }

  async getCurrentOffers() {
    const coupons = await this.prisma.coupon.findMany({
      where: { isActive: true },
      orderBy: { expiryDate: 'asc' },
      take: 3
    });

    return coupons.map(coupon => {
      const progress = coupon.usageLimit 
        ? Math.round((coupon.usageCount / coupon.usageLimit) * 100)
        : 60;
      
      return {
        title: coupon.type === 'percentage' 
          ? `${coupon.value}% Discount Offer`
          : `₹${coupon.value} Coupon`,
        status: coupon.expiryDate 
          ? `Expire on: ${new Date(coupon.expiryDate).toLocaleDateString('en-GB')}`
          : 'No expiry',
        progress,
        type: coupon.type === 'percentage' ? 'discount' : 'coupon'
      };
    });
  }
}
