import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/entities/product';
import { ProductsService } from 'src/app/services/rest/products.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit {

  validateForm: FormGroup;

  foundProduct!: Product;
  scannedProducts: Product[] = [];

  constructor(private fb: FormBuilder, private products_service: ProductsService) {
    this.validateForm = this.fb.group({
      barcode: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
  }

  addFoundProduct() {
    const listed = this.scannedProducts.find(p => p.barcode === this.foundProduct.barcode);
    if (!listed) {
      this.scannedProducts = [...this.scannedProducts, this.foundProduct];
    } else {
      // make logic so products with duplicate barcodes will be incremented in the amount instead of added
    }
  }

  removeProduct(data: any) {
    this.scannedProducts = this.scannedProducts.filter(p => p.barcode !== data.barcode);
  }

  findProductByBarcode() {
    const barcode = this.validateForm.value.barcode;
    this.products_service.getProductByBarcode(barcode)
      .subscribe((res: Product) => {
        console.log(res);
        this.foundProduct = res;
      })
  }

}
