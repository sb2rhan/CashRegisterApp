import { Product } from "./product";
import { Purchase } from "./purchase";

export class PurchaseProduct {

    public constructor(public productId: string, public purchaseId: string, public purchasedAmount: number
        /*public purchase: Purchase, public product: Product*/) {

    }
}