import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  private prisma = new PrismaClient();

  create(createCustomerDto: CreateCustomerDto) {
    return 'This action adds a new customer';
  }

  async findAll(page: number = 1, limit: number = 10, search: string = '') {
    const skip = (page - 1) * limit;
    
    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' as any } },
        { email: { contains: search, mode: 'insensitive' as any } },
        { phone: { contains: search, mode: 'insensitive' as any } },
      ],
    } : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: {
          orders: {
            select: {
              total: true,
              createdAt: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    const data = users.map(user => ({
      id: user.id,
      name: user.name || 'N/A',
      email: user.email || 'N/A',
      phone: user.phone || 'N/A',
      ordersCount: user.orders.length,
      totalSpent: user.orders.reduce((sum, order) => sum + parseFloat(order.total), 0),
      status: user.isActive ? 'Active' : 'Inactive',
      joinDate: user.createdAt,
      lastOrder: user.orders.length > 0 
        ? user.orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0].createdAt 
        : null,
    }));

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  findOne(id: number) {
    try {
      return this.prisma.user.findUnique({
        where: { id },
        include: {
          orders: {
            select: {
              id: true,
              total: true,
              createdAt: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Failed to fetch user');
    }
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    try {
      return this.prisma.user.update({
        where: { id },
        data: updateCustomerDto,
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }

  remove(id: number) {
    try {
      return this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Error removing user:', error);
      throw new Error('Failed to remove user');
    }
  }

  async searchByPhone(phone: string) {
    if (!phone || phone.length < 3) {
      return [];
    }

    const users = await this.prisma.user.findMany({
      where: {
        phone: {
          contains: phone,
        },
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
      },
      take: 10,
    });

    return users;
  }
}
