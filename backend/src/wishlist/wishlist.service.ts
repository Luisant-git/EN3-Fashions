import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async addToWishlist(userId: number, productId: number) {
    return this.prisma.wishlistItem.create({
      data: { userId, productId },
    });
  }

  async removeFromWishlist(userId: number, productId: number) {
    return this.prisma.wishlistItem.deleteMany({
      where: { userId, productId },
    });
  }

  async getWishlist(userId: number) {
    const items = await this.prisma.wishlistItem.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    
    const productIds = items.map(item => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, status: 'active' },
      include: { category: true, subCategory: true, brand: true },
    });

    return products.map(product => {
      const firstColor = product.colors[0] as any;
      const firstSize = firstColor?.sizes?.[0];
      const firstGallery = product.gallery[0] as any;
      return {
        id: product.id,
        name: product.name,
        price: firstSize?.price || product.basePrice,
        imageUrl: firstColor?.image || firstGallery?.url,
      };
    });
  }
}
