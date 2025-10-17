import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        ...createProductDto,
        gallery: createProductDto.gallery as any,
        colors: createProductDto.colors as any,
      },
    });
  }

  findAll() {
    return this.prisma.product.findMany({
      include: {
        category: true,
        subCategory: true,
        brand: true,
      },
    });
  }

  findAllActive() {
    return this.prisma.product.findMany({
      where: {
        status: 'active',
      },
      include: {
        category: true,
        subCategory: true,
        brand: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        subCategory: true,
        brand: true,
      },
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    const { id: _, createdAt, updatedAt, category, subCategory, brand, ...data } = updateProductDto as any;
    return this.prisma.product.update({
      where: { id },
      data: {
        ...data,
        gallery: data.gallery as any,
        colors: data.colors as any,
      },
    });
  }

  remove(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }

  updateBundleOffers(id: number, bundleOffers: any[]) {
    return this.prisma.product.update({
      where: { id },
      data: { bundleOffers },
    });
  }

  async calculatePrice(id: number, selectedColors: string[]) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const colorCount = selectedColors.length;
    const bundleOffer = (product.bundleOffers as any[])?.find(
      offer => offer.colorCount === colorCount
    );
    
    const price = bundleOffer ? bundleOffer.price : product.basePrice;

    return {
      colorCount,
      price,
      selectedColors,
      availableColors: product.colors
    };
  }
}