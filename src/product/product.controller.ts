import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    Param, 
    Patch, 
    Post, 
    Put, 
    UploadedFiles, 
    UseInterceptors 
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';
import IProduct from '../interface/product.interface';
import { ApiConsumes, ApiOkResponse } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ParamDto } from './dto/param.dto';
import { NumberDto } from './dto/number.dto';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) {}

    // create a new product
    @Post('create')
    @ApiOkResponse({ type: ProductDto, isArray: false, description: 'Product created successfully' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FilesInterceptor('images'))
    async createProduct(@UploadedFiles() files: Array<Express.Multer.File> | any, @Body() productDto: ProductDto): Promise<IProduct> {
        // get all image id from images array
        const images = files.map(file => file.id);
        // get all other fields from the request body
        const { name,price, description, category, brand, colors, sizes,numberInStock } = productDto;
        // create a new product object
        const product = { name, price, description, images, category, brand, colors, sizes, numberInStock };
        return this.productService.createProduct(product);
    }

    // @Post('upload')
    // @ApiOkResponse({ description: 'Image uploaded successfully' })
    // @ApiConsumes('multipart/form-data')
    // @UseInterceptors(FilesInterceptor('images'))
    // async UploadImages(@UploadedFiles() images: Array<Express.Multer.File>|any, @Body() body:any): Promise<any> {
    //     // get all id from images array
    //     const imageIds = images.map(image => image.id);
    //     return {imageIds, body};
    // }

    // fetch all products
    @ApiOkResponse({type: ProductDto, isArray: true}) // swagger api decorator
    @Get('all')
    async findAllProducts(): Promise<IProduct[]> {
        return this.productService.findAllProducts();
    }

    // update the number of product in stock
    @ApiOkResponse({type: ProductDto}) // swagger api decorator
    @Put('update-number-in-stock/:id')
    async updateNumberInStock(@Param() param: any, @Body() body: NumberDto): Promise<IProduct> {
        const { id } = param;
        const { number } = body;
        return this.productService.updateNumberInStock(id, number);
    }

    // increate the number in stock by a specific number
    @ApiOkResponse({type: ProductDto}) // swagger api decorator
    @Patch('increase-number-in-stock-by/:id')
    async increaseNumberInStockBy(@Param() param: ParamDto, @Body() body: NumberDto): Promise<IProduct> {
        const { id } = param;
        const { number } = body;
        return this.productService.increaseNumberInStockBy(id, number);
    }

    // reduce the number of product in stock by 1
    @ApiOkResponse({type: ProductDto}) // swagger api decorator
    @Patch('reduce-number-in-stock/:id')
    async reduceNumberInStock(@Param() param: ParamDto): Promise<IProduct> {
        const { id } = param;
        return this.productService.reduceNumberInStock(id);
    }

    // reduce the number of product in stock by a specific number
    @ApiOkResponse({type: ProductDto}) // swagger api decorator
    @Patch('reduce-number-in-stock-by/:id')
    async reduceNumberInStockBy(@Param() param: ParamDto, @Body() body: NumberDto): Promise<IProduct> {
        const { id } = param;
        const { number } = body;
        return this.productService.reduceNumberInStockBy(id, number);
    }

    // update the product
    @ApiOkResponse({type: ProductDto}) // swagger api decorator
    @Patch('update/:id')
    async updateProduct(@Param() param: ParamDto, @Body() product: ProductDto): Promise<IProduct> {
        const { id } = param;
        return this.productService.updateProduct(id, product);
    }

    // delete the product
    @ApiOkResponse({type: String}) // swagger api decorator
    @Delete('delete/:id')
    async deleteProduct(@Param() param: ParamDto): Promise<IProduct> {
        const { id } = param;
        return this.productService.deleteProduct(id);
    }
}
