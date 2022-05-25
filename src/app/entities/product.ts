export class Product {
    public barcode!: string;
    public name!: string;
    public amount: number = 0;
    public price!: number;
    public discountRate: number = 0.0;

    public id!: string;
    public supplierId!: string;
    public categoryId!: string;
}
