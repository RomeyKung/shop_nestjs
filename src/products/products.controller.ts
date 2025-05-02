import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProductRequest } from './dto/create-product.request';
import { CurrentUser } from '../auth/decorators/get-user.decorator';
import { TokenPayload } from '../auth/interfaces/token-payload.interface';
import { ProductsService } from './products.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PRODUCT_IMAGES } from './product-images';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtGuard)
  async createProduct(
    @Body() body: CreateProductRequest,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.productsService.createProduct(body, user.userId);
  }

  @Get()
  @UseGuards(JwtGuard)
  async getProducts(@Query('status') status?: string) {
    return this.productsService.getProducts(status);
  }

  @Post(':productId/image')
  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      // Handles file upload with field name 'image'
      storage: diskStorage({
        destination: PRODUCT_IMAGES, // Saves files in public/products directory
        filename: (req, file, callback) => {
          // Custom filename logic
          callback(
            null,
            `${req.params.productId}${extname(file.originalname)}`, // Uses productId + original extension
          );
        },
      }),
      fileFilter: (req, file, callback) => {
        if (file.mimetype === 'image/jpeg') {
          callback(null, true); // accept file
        } else {
          callback(
            new BadRequestException('Only JPEG images are allowed!'),
            false,
          ); // reject file
        }
      },
    }),
  )
  async uploadProductImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500000 }), // Max 500KB(5MB) file size
          new FileTypeValidator({ fileType: 'image/jpeg' }), // Only JPEG images allowed
        ],
      }),
    )
    _file: Express.Multer.File, // The uploaded file (underscore prefix means unused)
  ) {
    // console.log('Received file info:', {
    //   originalname: file.originalname,
    //   mimetype: file.mimetype,
    //   size: file.size,
    // });
    // return { success: true };
  }

  @Get(':productId')
  @UseGuards(JwtGuard)
  async getProduct(@Param('productId') productId: string) {
    return this.productsService.getProduct(+productId);
  }
}
