import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ShiprocketService {
  private readonly baseUrl = 'https://apiv2.shiprocket.in/v1/external';
  private token: string | null = null;
  private tokenExpiry: number | null = null;

  constructor(private prisma: PrismaService) {}

  private async login() {
    // Check if token is still valid (Shiprocket tokens usually last 24h)
    if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    try {
      const response = await axios.post(`${this.baseUrl}/auth/login`, {
        email: 'en3fashions@gmail.com',
        password: 'RLq1WuMnejxytCnMC$7*tah2yW*@2jCD',
      });

      this.token = response.data.token;
      // Set expiry to 23 hours from now to be safe
      this.tokenExpiry = Date.now() + 23 * 60 * 60 * 1000;
      return this.token;
    } catch (error) {
      console.error('Shiprocket login failed:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to authenticate with Shiprocket');
    }
  }

  async createShiprocketOrder(orderId: number) {
    const token = await this.login();
    
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, user: true },
    });

    if (!order) throw new Error('Order not found');

    const shippingAddress: any = order.shippingAddress;
    
    // Preparation for Shiprocket order creation
    const shiprocketData = {
      order_id: order.id.toString(),
      order_date: order.createdAt.toISOString().split('T')[0],
      pickup_location: "Primary", // Should ideally be configurable
      billing_customer_name: shippingAddress.fullName || order.user?.name || 'Customer',
      billing_last_name: "",
      billing_address: shippingAddress.addressLine1,
      billing_address_2: shippingAddress.addressLine2 || "",
      billing_city: shippingAddress.city,
      billing_pincode: shippingAddress.pincode,
      billing_state: shippingAddress.state,
      billing_country: "India",
      billing_email: order.user?.email || "customer@example.com",
      billing_phone: shippingAddress.mobile || order.user?.phone || "",
      shipping_is_billing: true,
      order_items: order.items.map(item => ({
        name: item.name,
        sku: item.sizeVariantId || item.productId?.toString() || 'SKU',
        units: item.quantity,
        selling_price: parseFloat(item.price),
        discount: 0,
        tax: 0,
        hsn: item.hsnCode || ""
      })),
      payment_method: order.paymentMethod.toUpperCase() === 'COD' ? 'Postpaid' : 'Prepaid',
      shipping_charges: parseFloat(order.deliveryFee),
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: parseFloat(order.discount || '0'),
      sub_total: parseFloat(order.total),
      length: 10, // Default dimensions
      width: 10,
      height: 10,
      weight: 0.5
    };

    try {
      const response = await axios.post(`${this.baseUrl}/orders/create/adhoc`, shiprocketData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Shiprocket order creation failed:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to create Shiprocket shipment');
    }
  }

  async getTrackingInfo(shipmentId: string) {
    const token = await this.login();
    try {
      const response = await axios.get(`${this.baseUrl}/courier/track/shipment/${shipmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Shiprocket tracking failed:', error.response?.data || error.message);
      return null;
    }
  }
}
