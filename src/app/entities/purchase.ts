import { Product } from "./product";

export class Purchase {
    public total!: number;
    public purchaseDate!: string;
    public purchaseType!: string;
    public taxRate: number = 0.0;

    public id!: string;
    public cashierId!: string;
    public bonusCardId!: string;
    public products!: Product[];
}