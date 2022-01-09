import { Component, OnInit } from '@angular/core';
import { JsonObject } from '@angular-devkit/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute,Router } from '@angular/router';
import { SellerAccountService } from "./../../services/seller-account.service";
import {MatDialog} from '@angular/material/dialog';
import { LocalStorageService } from 'ngx-webstorage';
export interface PeriodicElement {
  // daysProductCode:string;
  productId:string;
  productIdType:string;
  color: string;
  size:string;
  stock:number,
  SKUId:string;
  yourPrice:number;
  maximumRetailPrice:0;
  expiryDate_Img: string;
  importerMRP_Img:string;
  productSeal_Img:string,
  product_Img1:string,
  MainImg:string
}
  
@Component({
  selector: 'app-view-prodoct-variants',
  templateUrl: './view-prodoct-variants.component.html',
  styleUrls: ['./view-prodoct-variants.component.css']
})
export class ViewProdoctVariantsComponent implements OnInit {
  displayedColumns: string[] = ['productId','productIdType','color','flavour','expiryDate','size','stock', 'SKUId','maximumRetailPrice','yourPrice','expiryDate_Img', 'importerMRP_Img','productSeal_Img','product_Img1','MainImg'];
  dataSource: Array<any> = [];
  globalUrl:string;
  getProductVariant(id:string) {
    let params: JsonObject = { id: id};
    this.ProductListService.getProductVariant(params)
      .subscribe((payload) => {
        var response = JSON.parse(JSON.stringify(payload));
       // console.log("response...............",response);
        if (!response.error) {
          this.dataSource = response.data.productVariant;
        } else {
          this.toastr.error(response.message);
        }
      }, (error) => {
        this.toastr.error(error.status + " : " + error.statusText);
      });
  }

  constructor( public dialog: MatDialog,
    private toastr: ToastrService,
    private router:Router,
    private activatedRoute: ActivatedRoute,
    private ProductListService: SellerAccountService,
    private local: LocalStorageService) { 
      let accessToken = this.local.retrieve('accessToken');
      let type = this.local.retrieve('type');
      if (!accessToken || type !== 'vendor') {
        this.router.navigateByUrl('/');
      }
      this.getProductVariant(this.activatedRoute.snapshot.queryParamMap.get("id"));
    }

  ngOnInit(): void {
  }

  showImage(url:any){
    this.globalUrl = url;
  }

}
