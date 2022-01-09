import { Component,ViewChild, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators} from "@angular/forms";
import { SellerAccountService } from './../../services/seller-account.service';
import { JsonObject } from '@angular-devkit/core';
import { ToastrService } from 'ngx-toastr';
import{Router} from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';

export interface PeriodicElement {
  _id:string,
  title: string;
  brandName: string;
  manuFacturer: string;
  handlingPeriod: number;
  salePrice: number;
  maximumRetailPrice: number;
  countryOfOrigin: string;
  condition: string;
  status: string;

}

// const ELEMENT_DATA: PeriodicElement[] = [
//   {num:1,position: 'iPhone', name: 'iPhone', menu: 'ABC PVt', symbol:3, price:50, mrp:50, origin:'india', condition:'new'},
// ];

@Component({
  selector: 'app-product-days',
  templateUrl: './product-days.component.html',
  styleUrls: ['./product-days.component.css']
})
export class ProductDaysComponent implements OnInit {
  dataSource:any;
  displayedColumns: string[] = ['_id','title', 'brandName', 'manuFacturer', 'handlingPeriod', 'countryOfOrigin','productVariant', 'condition', 'status'];
  // dataSource = ELEMENT_DATA;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  getAllProductList() {
    let params: JsonObject = { "status": ["Processing","Active","Rejected","Pending"],"Type":"seller"};
    this.sellerAccountService.getAllProductList(params)
      .subscribe((payload) => {
        var response = JSON.parse(JSON.stringify(payload));
        if (!response.error) {
          this.dataSource = new MatTableDataSource(response.data);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator; 
        } else {
          this.toastr.error(response.message);
        }
      }, (error) => {
        this.toastr.error(error.status + " : " + error.statusText);
      });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  constructor( 
    private sellerAccountService:SellerAccountService,
    private toastr: ToastrService,
    private router:Router,
    private local: LocalStorageService,
    ) {
      
      let accessToken = this.local.retrieve('accessToken');
		  let type = this.local.retrieve('type');
      if (!accessToken || type !== 'vendor') {
        this.router.navigateByUrl('/');
      }
      this.getAllProductList();
   }

  ngOnInit(): void {

  }

  OpenProductVariants(id:any){
    this.router.navigate(['/view-prodoct-variants'], { queryParams: { id: id } });
  }
  VariantNotExist(){
    alert("Inventory Not Added yet");
  }
  addVariants(id:any,status:any,title:any){
    if(status == "Processing" || status=="Active"){
      this.router.navigate(['/addProductVariants'], { queryParams: { id: id, title:title} });
    }else{
      this.toastr.error("Only Allowed to Proccessing Product");
    }
    
  }

}
