export class Purchase {
    public purchaseDate!: string;

    public id!: string;
    public bonusCardId!: string;

    constructor(public total: number, public purchaseType: string,
        public cashierId: string, public taxRate: number = 0.0) {

    }
}
