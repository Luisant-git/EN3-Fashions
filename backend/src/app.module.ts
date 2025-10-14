import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { UploadModule } from './upload/upload.module';
import { BrandModule } from './brand/brand.module';
import { CategoryModule } from './category/category.module';
import { SubCategoryModule } from './subcategory/subcategory.module';

@Module({
  imports: [UserModule, AuthModule, ProductModule, UploadModule, BrandModule, CategoryModule, SubCategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
