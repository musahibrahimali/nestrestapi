import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductSchema, Product } from './schemas/product.schema';
import { GridFsMulterConfigService } from './multer/gridfs.multer.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
    ]),
    MulterModule.registerAsync({
      useClass: GridFsMulterConfigService
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService]
})
export class ProductModule {}
