export class ProductDto {
    _id?: string;
    name: string;
    price: number;
    description: string;
    images?: string[];
    category?: string;
    brand?: string;
    colors?: string[];
    sizes?: string[];
    numberInStock: number;
}