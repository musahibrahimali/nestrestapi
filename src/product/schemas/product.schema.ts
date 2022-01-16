import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import { IsNumber, IsString } from "class-validator";
import {Document} from "mongoose";

export type ProductModel = Product & Document;

@Schema({ timestamps: true })
export class Product {
    @IsString()
    @Prop({ required: true })
    name: string;

    @IsNumber()
    @Prop({ required: true })
    price: number;

    @IsString()
    @Prop({ required: true })
    description: string;

    @Prop({ required: false })
    images: [string];

    @IsString()
    @Prop({ required: false })
    category: string;

    @IsString()
    @Prop({ required: false })
    brand: string;

    @Prop({ required: false })
    colors: [string];

    @Prop({ required: false })
    sizes: [string];

    @IsNumber()
    @Prop({ required: true })
    numberInStock: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);