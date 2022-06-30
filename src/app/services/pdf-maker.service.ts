import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const pdfMake = require('pdfmake/build/pdfmake.js');
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { ProductAmount } from '../entities/product';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfMakerService {

  constructor(private translate: TranslateService) { }

  printPaymentCard(products: ProductAmount[], taxRate: number, total: number, totalWTaxes: number) {
    let docDefinition = {
      content: [
        {
          text: 'StoreSystem SHOP',
          fontSize: 16,
          alignment: 'center',
          color: '#047886'
        },
        {
          text: this.translate.instant('workspace.receipt.heading'),
          fontSize: 20,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'skyblue'
        },
        {
          text: `${this.translate.instant('workspace.receipt.date')}: ${new Date().toLocaleString()}`,
          alignment: 'right'
        },
        {
          text: `${this.translate.instant('workspace.receipt.billNum')} : ${((Math.random() * 1000).toFixed(0))}`,
          alignment: 'right'
        },
        {
          text: this.translate.instant('workspace.receipt.orderDetails'),
          style: 'sectionHeader'
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              [this.translate.instant('workspace.table.product'), this.translate.instant('workspace.table.price'),
                this.translate.instant('workspace.table.quantity'), this.translate.instant('workspace.table.amount')],
              ...products.map(p => (
                [
                  p.product.name, p.product.price, p.quantity,
                  (p.product.price * p.quantity * (1 - p.product.discountRate)).toFixed(2) + 
                    ((p.product.discountRate != 0)
                      ? ", " + this.translate.instant('workspace.receipt.discount', {discount: p.product.discountRate * 100}) :"")
                ]
              )),
              [{ text: this.translate.instant('workspace.receipt.totalAmount'), colSpan: 3 }, {}, {}, total.toFixed(2)],
              [{ text: this.translate.instant('workspace.receipt.totalWTaxes', { taxRate: taxRate }), colSpan: 3 }, {}, {}, totalWTaxes.toFixed(2)]
            ]
          }
        }
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 20,
          margin: [0, 15, 0, 15]
        }
      }
    };

    pdfMake.createPdf(docDefinition).open();
  }

  printPaymentCash(products: ProductAmount[], taxRate: number, total: number, totalWTaxes: number, cash: number) {
    let change = cash - totalWTaxes;
    let docDefinition = {
      content: [
        {
          text: 'StoreSystem SHOP',
          fontSize: 16,
          alignment: 'center',
          color: '#047886'
        },
        {
          text: this.translate.instant('workspace.receipt.heading'),
          fontSize: 20,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'skyblue'
        },
        {
          text: `${this.translate.instant('workspace.receipt.date')}: ${new Date().toLocaleString()}`,
          alignment: 'right'
        },
        {
          text: `${this.translate.instant('workspace.receipt.billNum')} : ${((Math.random() * 1000).toFixed(0))}`,
          alignment: 'right'
        },
        {
          text: this.translate.instant('workspace.receipt.orderDetails'),
          style: 'sectionHeader'
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              [this.translate.instant('workspace.table.product'), this.translate.instant('workspace.table.price'),
                this.translate.instant('workspace.table.quantity'), this.translate.instant('workspace.table.amount')],
              ...products.map(p => (
                [
                  p.product.name, p.product.price, p.quantity,
                  (p.product.price * p.quantity * (1 - p.product.discountRate)).toFixed(2) + 
                    ((p.product.discountRate != 0)
                      ? ", " + this.translate.instant('workspace.receipt.discount', {discount: p.product.discountRate * 100}) :"")
                ]
              )),
              [{ text: this.translate.instant('workspace.receipt.totalAmount'), colSpan: 3 }, {}, {}, total.toFixed(2)],
              [{ text: this.translate.instant('workspace.receipt.totalWTaxes', { taxRate: taxRate }), colSpan: 3 }, {}, {}, totalWTaxes.toFixed(2)],
              [{ text: this.translate.instant('workspace.receipt.cash'), colSpan: 3 }, {}, {}, cash.toFixed(2)],
              [{ text: this.translate.instant('workspace.receipt.change'), colSpan: 3 }, {}, {}, change.toFixed(2)],
            ]
          }
        }
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 20,
          margin: [0, 15, 0, 15]
        }
      }
    };

    pdfMake.createPdf(docDefinition).open();
  }
}
