import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getStats() {
    return this.dashboardService.getDashboardStats();
  }

  @Get('sales-analytics')
  async getSalesAnalytics() {
    return this.dashboardService.getSalesAnalytics();
  }

  @Get('top-products')
  async getTopProducts() {
    return this.dashboardService.getTopSellingProducts();
  }

  @Get('offers')
  async getOffers() {
    return this.dashboardService.getCurrentOffers();
  }

  @Get('recent-orders')
  async getRecentOrders() {
    return this.dashboardService.getRecentOrders();
  }
}
