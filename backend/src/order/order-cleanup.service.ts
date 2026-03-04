import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma.service';

@Injectable()
export class OrderCleanupService {
  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async cleanupPendingOrders() {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    
    const result = await this.prisma.order.updateMany({
      where: {
        status: 'Pending',
        createdAt: { lt: fifteenMinutesAgo }
      },
      data: { status: 'Abandoned' }
    });

    if (result.count > 0) {
      console.log(`Marked ${result.count} pending orders as abandoned`);
    }
  }
}
