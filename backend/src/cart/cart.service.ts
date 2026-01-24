import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(userId: number, addToCartDto: AddToCartDto) {
    // Get or create cart for user
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: true }
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: { items: true }
      });
    }

    // Extract product ID for single items
    const productId = addToCartDto.type === 'bundle' ? null : 
      (typeof addToCartDto.id === 'number' ? addToCartDto.id : parseInt(addToCartDto.id || '0'));

    // Check if item already exists in cart
    const existingItem = cart.items.find(item => {
      if (addToCartDto.type === 'bundle') {
        return false; // Bundles are always added as new items
      }
      return item.productId === productId && 
             item.size === addToCartDto.size && 
             item.color === addToCartDto.color;
    });

    if (existingItem) {
      // Update quantity for existing item
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + (addToCartDto.quantity || 1) }
      });
    }

    // Create new cart item
    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        name: addToCartDto.name,
        price: addToCartDto.price,
        imageUrl: addToCartDto.imageUrl,
        size: addToCartDto.size,
        color: addToCartDto.color,
        colorVariantId: addToCartDto.colorVariantId,
        quantity: addToCartDto.quantity || 1,
        type: addToCartDto.type || 'single',
        bundleItems: addToCartDto.items ? JSON.parse(JSON.stringify(addToCartDto.items)) : undefined,
        hsnCode: addToCartDto.hsnCode
      }
    });
  }

  async getCart(userId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: true }
    });

    return cart?.items || [];
  }

  async removeFromCart(userId: number, itemId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId }
    });

    if (!cart) return null;

    return this.prisma.cartItem.delete({
      where: { 
        id: itemId,
        cartId: cart.id 
      }
    });
  }

  async updateQuantity(userId: number, itemId: number, quantity: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId }
    });

    if (!cart) return null;

    return this.prisma.cartItem.update({
      where: { 
        id: itemId,
        cartId: cart.id 
      },
      data: { quantity }
    });
  }

  async clearCart(userId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId }
    });

    if (!cart) return null;

    return this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });
  }
}