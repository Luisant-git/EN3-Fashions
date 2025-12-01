import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreatePincodeDto } from './create-pincode.dto';
import { UpdatePincodeDto } from './update-pincode.dto';

@Injectable()
export class PincodeService {
  constructor(private prisma: PrismaService) {}

  create(createPincodeDto: CreatePincodeDto) {
    return this.prisma.pincode.create({
      data: createPincodeDto,
    });
  }

  findAll() {
    return this.prisma.pincode.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.pincode.findUnique({
      where: { id },
    });
  }

  update(id: number, updatePincodeDto: UpdatePincodeDto) {
    return this.prisma.pincode.update({
      where: { id },
      data: updatePincodeDto,
    });
  }

  remove(id: number) {
    return this.prisma.pincode.delete({
      where: { id },
    });
  }
}
