import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product, ProductAmount } from 'src/app/entities/product';
import { ProductsService } from 'src/app/services/rest/products.service';

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { PurchaseProductsService } from 'src/app/services/rest/purchaseproducts.service';
import { PurchaseProduct } from 'src/app/entities/purchaseproduct';
import { PurchasesService } from 'src/app/services/rest/purchases.service';
import { Purchase } from 'src/app/entities/purchase';
import { AuthService } from 'src/app/services/auth.service';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit {

  validateForm: FormGroup;

  selectedPayment = null;
  foundProduct!: Product;
  scannedProducts: ProductAmount[] = [];
  total: number = 0;
  taxes: number = 10;
  totalWTaxes: number = 0;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private productsService: ProductsService,
    private purchaseService: PurchasesService,
    private purchaseProductsService: PurchaseProductsService) {
    this.validateForm = this.fb.group({
      barcode: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
  }

  totalChanged() {
    this.total = 0;
    this.scannedProducts.forEach(sp => {
      this.total += (sp.quantity * sp.product.price);
    })
    this.totalWTaxes = this.total * (1 + this.taxes/100);
  }

  addFoundProduct() {
    const listed = this.scannedProducts.find(p => p.product.barcode === this.foundProduct.barcode);
    if (!listed) {
      this.scannedProducts = [...this.scannedProducts, new ProductAmount(this.foundProduct)];
    } else {
      listed.quantity++;
      // make logic so products with duplicate barcodes will be incremented in the amount instead of added
    }
    this.totalChanged();
  }

  removeProduct(c_product: any) {
    const index = this.scannedProducts.findIndex(p => p.product.barcode === c_product.barcode);
    if (index != -1) {
      this.scannedProducts = this.scannedProducts.filter(p => p.product.barcode !== c_product.barcode);
      this.totalChanged();
    }
  }

  findProductByBarcode() {
    const barcode = this.validateForm.value.barcode;
    if (barcode) {
      this.productsService.getProductByBarcode(barcode)
        .subscribe((res: Product) => {
          console.log(res);
          this.foundProduct = res;
        })
    }

  }

  quantityChanged($event: any, data: any) {
    debugger
    const prod = this.scannedProducts.find(p => p.product.barcode === data.product.barcode);
    if (prod) {
      prod.quantity = parseInt($event.target.value);
      this.totalChanged();
    }
  }

  // printReceipt() {
  //   let docDefinition = {
  //     header: 'StoreSystem Cash Register Receipt',
  //     content: [
  //       {
  //         text: 'StoreSystem SHOP',
  //         fontSize: 16,
  //         alignment: 'center',
  //         color: '#047886'
  //       },
  //       {
  //         text: 'RECEIPT',
  //         fontSize: 20,
  //         bold: true,
  //         alignment: 'center',
  //         decoration: 'underline',
  //         color: 'skyblue'
  //       },
  //       {
  //         text: `Date: ${new Date().toLocaleString()}`,
  //         alignment: 'right'
  //       },
  //       {
  //         text: `Bill No : ${((Math.random() * 1000).toFixed(0))}`,
  //         alignment: 'right'
  //       },
  //       {
  //         text: 'Order Details',
  //         style: 'sectionHeader'
  //       },
  //       {
  //         table: {
  //           headerRows: 1,
  //           widths: ['*', 'auto', 'auto', 'auto'],
  //           body: [
  //             ['Product', 'Price', 'Quantity', 'Amount'],
  //             ...this.invoice.products.map(p => ([p.name, p.price, p.qty, (p.price * p.qty).toFixed(2)])),
  //             [{ text: 'Total Amount', colSpan: 3 }, {}, {}, this.invoice.products.reduce((sum, p) => sum + (p.qty * p.price), 0).toFixed(2)]
  //           ]
  //         }
  //       }
  //     ],
  //     styles: {
  //       sectionHeader: {
  //         bold: true,
  //         decoration: 'underline',
  //         fontSize: 14,
  //         margin: [0, 15, 0, 15]
  //       }
  //     }
  //   };

  //   pdfMake.createPdf(docDefinition).open();
  // }

  sendPurchase() {
    const user = this.authService.getUserId()
    if (this.selectedPayment && this.totalWTaxes > 0 && user != null) {
      const purchase = new Purchase(this.totalWTaxes, this.selectedPayment,
        user, parseFloat((this.taxes / 100).toFixed(4)));
      this.purchaseService.createPurchase(purchase)
        .subscribe(res => {
          this.scannedProducts.forEach(p => {
            this.purchaseProductsService.createPurchaseProduct(
              new PurchaseProduct(p.product.id, res.id, p.quantity)
            ).subscribe(res => console.log(res));
          });
        });
    }
  }
}
