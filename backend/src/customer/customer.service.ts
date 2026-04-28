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

 async findAll(page: number = 1, limit: number = 10, search: string = '', startDate?: string, endDate?: string, statusFilter?: string) {
  const skip = (page - 1) * limit;
  
  const where: any = {};
  
  // Search filter
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' as any } },
      { email: { contains: search, mode: 'insensitive' as any } },
      { phone: { contains: search, mode: 'insensitive' as any } },
    ];
  }
  
  // Date filter
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) {
      where.createdAt.gte = new Date(startDate);
    }
    if (endDate) {
      const endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999);
      where.createdAt.lte = endDateTime;
    }
  }

  // Get all users first (without pagination for filtering by orders)
  let allUsers = await this.prisma.user.findMany({
    where,
    include: {
      orders: {
        select: {
          paymentMethod: true,
          status: true,
          total: true,
          createdAt: true,  // Add this line
        },
      },
    },
  });

  // Apply status filter for online_paid and abandoned
  if (statusFilter === 'online_paid') {
    allUsers = allUsers.filter(user => 
      user.orders.some(order => 
        order.paymentMethod?.toLowerCase() !== 'cod' && 
        order.paymentMethod?.toLowerCase() !== 'cash on delivery'
      )
    );
  } else if (statusFilter === 'abandoned') {
    allUsers = allUsers.filter(user => 
      user.orders.some(order => order.status === 'Abandoned')
    );
  } else if (statusFilter === 'login') {
    // Login customers are all customers with accounts (already filtered)
    // No additional filter needed
  }

  const total = allUsers.length;
  
  // Apply pagination after filtering
  const users = allUsers.slice(skip, skip + limit);

  const data = users.map(user => ({
    id: user.id,
    name: user.name || 'N/A',
    email: user.email || 'N/A',
    phone: user.phone || 'N/A',
    ordersCount: user.orders.length,
    totalSpent: user.orders.reduce((sum, order) => sum + parseFloat(order.total || '0'), 0),
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

async getCustomerStats(startDate?: string, endDate?: string) {
  try {
    // Build date filter
    const dateFilter: any = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) {
        dateFilter.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        dateFilter.createdAt.lte = endDateTime;
      }
    }

    // Get all customers with date filter
    const allCustomers = await this.prisma.user.findMany({
      where: dateFilter,
      select: { id: true }
    });

    // Get all orders with date filter
    const allOrders = await this.prisma.order.findMany({
      where: dateFilter,
      select: {
        userId: true,
        paymentMethod: true,
        status: true
      }
    });

    // Get users who placed ONLINE orders (not COD)
    const onlineOrders = allOrders.filter(order => 
      order.paymentMethod?.toLowerCase() !== 'cod' && 
      order.paymentMethod?.toLowerCase() !== 'cash on delivery'
    );
    const usersWithOnlineOrders = new Set(onlineOrders.map(order => order.userId).filter(id => id));
    const onlineOrderedCount = usersWithOnlineOrders.size;

    // Get abandoned orders count (unique users)
    const abandonedOrders = allOrders.filter(order => order.status === 'Abandoned');
    const abandonedUsers = new Set(abandonedOrders.map(order => order.userId).filter(id => id));
    const abandonedCount = abandonedUsers.size;

    return {
      totalCustomers: allCustomers.length,
      loginCustomers: allCustomers.length,
      onlineOrderedCustomers: onlineOrderedCount,
      abandonedCustomers: abandonedCount
    };
  } catch (error) {
    console.error('Error fetching customer stats:', error);
    throw new Error('Failed to fetch customer stats');
  }
}


}
