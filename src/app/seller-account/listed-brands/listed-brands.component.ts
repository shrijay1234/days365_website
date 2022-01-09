import { Component, OnInit } from '@angular/core';
import { JsonObject } from '@angular-devkit/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { SellerAccountService } from "./../../services/seller-account.service";
import { ProductService } from "app/services/product.service";
import { MatDialog } from '@angular/material/dialog';

import { LocalStorageService } from 'ngx-webstorage';
@Component({
  selector: 'app-listed-brands',
  templateUrl: './listed-brands.component.html',
  styleUrls: ['./listed-brands.component.css']
})
export class ListedBrandsComponent implements OnInit {

  displayedColumns: string[] = ['brandName', 'brandWebsite', 'image', 'status', 'categoryName','remark'];
  dataSource: Array<any> = [];


  constructor(public dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private ProductListService: SellerAccountService,
    private local: LocalStorageService,
    private productService: ProductService) {
   
    let accessToken = this.local.retrieve('accessToken');
    let type = this.local.retrieve('type');
    if (!accessToken || type !== 'vendor') {

      this.router.navigateByUrl('/');
    }
  }

  ngOnInit(): void {
    this.getListedBrands();
  }


  getListedBrands() {
    this.dataSource = [];
    this.productService.getSellerBtrands().subscribe((payload) => {
      let response = JSON.parse(JSON.stringify(payload));
      if (!response.error) {
        this.dataSource = response.data;
        console.log(this.dataSource)
      }
      else {
        this.toastr.error(response.message);
      }
    }, (error) => {
      this.toastr.error(error.status + " : " + error.statusText);
    });
  }

  viewImage(url: string) {
    window.open(url, "__blank");
  }
}
