import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ProductService } from 'src/modules/product/product.service';
import { User } from 'src/common/decorators/user.decorator';
import { JwtUser } from 'src/user/interfaces/jwt-user.interface';
import { ProductCategory } from 'src/model/product-category';
import { Product } from 'src/model/product';

@ApiTags('제품 API')
@UseGuards(AuthGuard)
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  async getProduct(@User() user: JwtUser): Promise<Product[]> {
    return this.productService.getProduct(user);
  }

  @Get('category')
  async getProductCategory(@User() user: JwtUser): Promise<ProductCategory[]> {
    return this.productService.getProductCategory(user);
  }
}