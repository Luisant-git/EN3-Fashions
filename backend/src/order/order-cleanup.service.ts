import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma.service';

@Injectable()
export class OrderCleanupService {
  constructor(private prisma: PrismaService) {}

  // Run every 2 minutes to cleanup old pending orders
  @Cron('*/2 * * * *')
  async cleanupPendingOrders() {
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    
    const result = await this.prisma.order.updateMany({
      where: {
        status: 'Pending',
        createdAt: { lt: twoMinutesAgo }
      },
      data: { status: 'Abandoned' }
    });

    if (result.count > 0) {
      console.log(`Auto-cleanup: Marked ${result.count} pending orders as abandoned`);
    }
  }

  // Manual cleanup method that can be called when needed
  async manualCleanup() {
    return this.cleanupPendingOrders();
  }
}
