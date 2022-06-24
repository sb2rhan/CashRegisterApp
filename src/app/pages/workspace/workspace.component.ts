import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product, ProductAmount } from 'src/app/entities/product';
import { ProductsService } from 'src/app/services/rest/products.service';

import { PurchaseProductsService } from 'src/app/services/rest/purchaseproducts.service';
import { PurchaseProduct } from 'src/app/entities/purchaseproduct';
import { PurchasesService } from 'src/app/services/rest/purchases.service';
import { Purchase } from 'src/app/entities/purchase';
import { AuthService } from 'src/app/services/auth.service';
import { PdfMakerService } from 'src/app/services/pdf-maker.service';


@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit {

  validateFormBarcode: FormGroup;
  validateFormPurchase: FormGroup;

  foundProduct!: Product | null;
  scannedProducts: ProductAmount[] = [];
  total: number = 0;
  taxes: number = 10;
  totalWTaxes: number = 0;

  selectedTypeCash: boolean = false;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private pdfService: PdfMakerService,
    private productsService: ProductsService,
    private purchaseService: PurchasesService,
    private purchaseProductsService: PurchaseProductsService) {

    this.validateFormBarcode = this.fb.group({
      barcode: [null, [Validators.required]]
    });

    this.validateFormPurchase = this.fb.group({
      selectedPayment: [null, [Validators.required]],
      cash: [null, [Validators.nullValidator]],
    })
  }

  ngOnInit(): void {
  }

  totalChanged() {
    this.total = 0;
    this.scannedProducts.forEach(sp => {
      this.total += (sp.quantity * sp.product.price * (1.0000 - sp.product.discountRate));
    })
    this.totalWTaxes = this.total * (1 + this.taxes / 100);
  }

  paymentOptionChanged($event: string) {
    if ($event === "CASH") {
      this.selectedTypeCash = true;
    } else {
      this.selectedTypeCash = false;
    }
  }

  addFoundProduct() {
    if (this.foundProduct) {
      const listed = this.scannedProducts.find(p => p.product.barcode === this.foundProduct?.barcode);
      if (!listed) {
        this.scannedProducts = [...this.scannedProducts, new ProductAmount(this.foundProduct)];
      } else {
        listed.quantity++;
      }
      this.totalChanged();
    }

  }

  removeProduct(c_product: any) {
    const index = this.scannedProducts.findIndex(p => p.product.barcode === c_product.barcode);
    if (index != -1) {
      this.scannedProducts = this.scannedProducts.filter(p => p.product.barcode !== c_product.barcode);
      this.totalChanged();
    }
  }

  findProductByBarcode() {
    const barcode = this.validateFormBarcode.value.barcode;
    if (barcode) {
      this.productsService.getProductByBarcode(barcode)
        .subscribe((res: Product) => {
          this.foundProduct = res;
        })
    } else {
      Object.values(this.validateFormBarcode.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  // ngModelOnChanged
  quantityChanged($event: any, data: any) {
    const prod = this.scannedProducts.find(p => p.product.barcode === data.product.barcode);
    const q = $event;
    if (prod && q > 0) {
      prod.quantity = q;
      this.totalChanged();
    }
  }

  printReceipt(cash?: number) {
    if (this.selectedTypeCash && cash) {
      this.pdfService.printPaymentCash(this.scannedProducts, this.taxes, this.total, this.totalWTaxes, cash);
    } else {
      this.pdfService.printPaymentCard(this.scannedProducts, this.taxes, this.total, this.totalWTaxes);
    }
  }

  sendPurchase() {
    const cashier = this.authService.getUserId();

    if (this.validateFormPurchase.valid && this.totalWTaxes > 0 && cashier != null) {
      const selectedPayment: string = this.validateFormPurchase.value.selectedPayment;

      const purchase = new Purchase(this.totalWTaxes, selectedPayment,
        cashier, parseFloat((this.taxes / 100).toFixed(4)));

      if (selectedPayment === "CASH") {
        purchase.cash = this.validateFormPurchase.value.cash;
      }

      this.purchaseService.createPurchase(purchase)
        .subscribe(res => {

          this.printReceipt(res.cash);

          this.scannedProducts.forEach(p => {
            this.purchaseProductsService.createPurchaseProduct(
              new PurchaseProduct(p.product.id, res.id, p.quantity)
            ).subscribe(res => {
              p.product.stockAmount -= res.purchasedAmount;

              this.productsService.updateProduct(p.product.id, p.product)
                .subscribe(res => {
                  this.scannedProducts = [];
                  this.totalChanged();
                  this.validateFormBarcode.reset();
                  this.validateFormPurchase.reset();
                  this.foundProduct = null;
                  this.paymentOptionChanged("");
                });
            });
          });
        });

    } else {
      Object.values(this.validateFormPurchase.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
