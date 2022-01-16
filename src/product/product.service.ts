import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Product, ProductModel } from './schemas/product.schema';
import IProduct from '../interface/product.interface';
import { ProductDto } from './dto/product.dto';
import { MongoGridFS } from 'mongo-gridfs';
import { GridFSBucketReadStream } from 'mongodb';

@Injectable()
export class ProductService {
    private fileModel: MongoGridFS;
    constructor(
        @InjectModel(Product.name) private productModel:Model<ProductModel>,
        @InjectConnection() private readonly connection: Connection
    ) {
        this.fileModel = new MongoGridFS(this.connection.db, 'productImages');
    }

    // create a new product
    async createProduct(product: ProductDto): Promise<IProduct | any> {
        try{
            const newProduct = new this.productModel(product);
            return await newProduct.save();
        }catch(err){
            // return the error message and code
            return {
                message: err.message,
            };
        }
    }

    // fetch all products
    async findAllProducts(): Promise<IProduct[] | any> {
        try{
            const products = await this.productModel.find();
            const allProducts = [];
            for (const product of products) {
                const imageIds = product.images.map(image => image);
                // read the images with the ids
                const images = await Promise.all(imageIds.map(async (id) => await this.readStream(id)));
                const productInfo = {
                    ...product.toObject(),
                    images: images,
                };
                allProducts.push(productInfo);
            }
            return allProducts;
        }catch(err){
            // return the error message and code
            return {
                message: err.message,
            };
        }
    }

    // update the number of product in stock
    async updateNumberInStock(id: string, numberInStock: number): Promise<IProduct | any> {
        try{
            return await this.productModel.findByIdAndUpdate(id, { numberInStock: numberInStock });
        }catch(err){
            // return the error message and code
            return {
                message: err.message
            };
        }
    }

    // increate the number in stock by a specific number
    async increaseNumberInStockBy(id: string, number: number): Promise<IProduct | any> {
        try{
            const product = await this.productModel.findById(id);
            product.numberInStock += number;
            return await product.save();
        }catch(err){
            // return the error message and code
            return {
                message: err.message,
            };
        }
    }

    // reduce the number of product in stock by 1
    async reduceNumberInStock(id: string): Promise<IProduct | any> {
        try{
            // ony reduce it if its not already zero
            const product = await this.productModel.findById(id);
            if (product.numberInStock > 0) {
                product.numberInStock--;
                return await product.save();
            }
            return product;
        }catch(err){
            // return the error message and code
            return {
                message: err.message,
            };
        }
    }

    // reduce the number of product in stock by a specific number
    async reduceNumberInStockBy(id: string, number: number): Promise<IProduct | any> {
        try{
            // ony reduce it if its not already zero
            const product = await this.productModel.findById(id);
            if (product.numberInStock > 0) {
                product.numberInStock -= number;
                return await product.save();
            }
            return product;
        }catch(err){
            // return the error message and code
            return {
                message: err.message,
            };
        }
    }

    // update the product
    async updateProduct(id:string, product: ProductDto): Promise<IProduct | any> {
        try{
            return await this.productModel.findByIdAndUpdate(id, product);
        }catch(err){
            // return the error message and code
            return {
                message: err.message,
            };
        }
    }

    // delete the product
    async deleteProduct(id: string): Promise<IProduct | any> {
        try{
            // delete all product images first
            const product = await this.productModel.findById(id);
            const imageIds = product.images.map(image => image);
            // delete the images
            await Promise.all(imageIds.map(async (id) => await this.deleteFile(id)));
            return await this.productModel.findByIdAndRemove(id);
        }catch(err){
            // return the error message and code
            return {
                message: err.message,
            };
        }
    }

    // private methods
    // read the file from the database
    private async readStream(id: string): Promise<GridFSBucketReadStream | any> {
        try{
            const fileStream = await this.fileModel.readFileStream(id);
            // get the file contenttype
            const contentType = await this.findInfo(id).then(result => result.contentType);
            // read data in chunks
            const chunks = [];
            fileStream.on('data', (chunk) => {
                chunks.push(chunk);
            });
            // convert the chunks to a buffer
            return new Promise((resolve, reject) => {
                fileStream.on('end', () => {
                    const buffer = Buffer.concat(chunks);
                    // convert the buffer to a base64 string
                    const base64 = buffer.toString('base64');
                    // convert the base64 string to a data url
                    const dataUrl = `data:${contentType};base64,${base64}`;
                    // resolve the data url
                    resolve(dataUrl);
                });
                // handle reject
                fileStream.on('error', (err) => {
                    reject(err);
                });
            });
        }catch(error){
            return error;
        }
    }

    private async findInfo(id: string): Promise<any> {
        try{
            const result = await this.fileModel
                .findById(id).catch( () => {throw new HttpException('File not found', HttpStatus.NOT_FOUND)} )
                .then(result => result)
                return{
                    filename: result.filename,
                    length: result.length,
                    chunkSize: result.chunkSize,
                    uploadDate: result.uploadDate,
                    contentType: result.contentType      
                }
        }catch(error){
            return error;
        }
    }

    // delete the file from the database
    private async deleteFile(id: string): Promise<boolean>{
        try{
            return await this.fileModel.delete(id)
        }catch(error){
            return false;
        }
    }
}
