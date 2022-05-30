import { Injectable } from '@angular/core';

const pdfMake = require('pdfmake/build/pdfmake.js');
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { ProductAmount } from '../entities/product';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfMakerService {

  print(products: ProductAmount[], taxRate: number, total: number, totalWTaxes: number) {
    let docDefinition = {
      content: [
        {
          text: 'StoreSystem SHOP',
          fontSize: 16,
          alignment: 'center',
          color: '#047886'
        },
        {
          text: 'RECEIPT',
          fontSize: 20,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'skyblue'
        },
        {
          text: `Date: ${new Date().toLocaleString()}`,
          alignment: 'right'
        },
        {
          text: `Bill No : ${((Math.random() * 1000).toFixed(0))}`,
          alignment: 'right'
        },
        {
          text: 'Order Details',
          style: 'sectionHeader'
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              ['Product', 'Price', 'Quantity', 'Amount'],
              ...products.map(p => (
                [
                  p.product.name, p.product.price, p.quantity,
                  `${(p.product.price * p.quantity * (1 - p.product.discountRate)).toFixed(2)} w Discount ${p.product.discountRate*100}%`
                ]
              )),
              [{ text: 'Total Amount', colSpan: 3 }, {}, {}, total.toFixed(2)],
              [{ text: `Total Amount with Tax(${taxRate}%)`, colSpan: 3 }, {}, {}, totalWTaxes.toFixed(2)]
            ]
          }
        }
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15, 0, 15]
        }
      }
    };

    pdfMake.createPdf(docDefinition).open();
  }
}
