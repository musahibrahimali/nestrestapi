interface IProduct {
    _id?: string;
    name: string;
    price: number;
    description: string;
    images?: string[];
    category?: string;
    brand?: string;
    color?: string;
    size?: string;
    numberInStock: number;
}

export default IProduct;