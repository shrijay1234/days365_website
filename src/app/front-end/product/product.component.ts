import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Options, LabelType } from "@angular-slider/ngx-slider";
import { ActivatedRoute } from '@angular/router';
import { JsonObject } from '@angular-devkit/core';
import { ProductService } from 'app/services/product.service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs';
import { ProductSimmilar } from '../home/home.component.class';
import { Router } from '@angular/router';
import * as _ from 'lodash';
declare var $: any;
import { LocalStorageService } from 'ngx-webstorage';
import { HomeService } from './../../services/home.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
	completeProductList = []
	productListArray:any= []
	p:any;
	filteroptions={ };
	typeSelected:string='';
	titleSearch:string='';
	categorySearch:string='';

	@HostListener('window:scroll', ['$event'])
	onScroll(e) {
		//console.log('window', e);
	}
	divScroll(e) {
		//console.log('div App', e);
	}
 	constructor(
		 public productService : ProductService,
		 private toastr: ToastrService,
		 private router:Router,
		 private route: ActivatedRoute,
		 private local:LocalStorageService,
		 private HomeService:HomeService
	) { }
	minValue: number = 0;
	maxValue: number = 10000;
	sliderValue =0;
   	options: Options = {
     floor: 0,
     ceil: 15000,
     translate: (value: number, label: LabelType): string => {
       switch (label) {
         case LabelType.Low:
           return "<b>Min price:</b> Rs." + value;
         case LabelType.High:
           return "<b>Max price:</b> Rs." + value;
         default:
           return "Rs." + value;
       }
     }
   };
	recordsPerLoad=4;
	totalProducts=0;
  	BrandList=[];
  	q=1
	ngOnInit(): void {

		this.getBrandName();

		this.route.queryParamMap
		.subscribe((params) => {
			this.filteroptions = {...params };
		});
		let filterApplied = {};

		if(this.filteroptions){

			if(this.filteroptions['params'].type!=undefined){
				filterApplied['type'] = this.filteroptions['params'].type;
			}
			if(this.filteroptions['params'].title!=undefined){
				filterApplied['title'] = this.filteroptions['params'].title;
			}
			if(this.filteroptions['params'].category!=undefined){
				filterApplied['categoryName'] = this.filteroptions['params'].category;
			}
		}
		if(!filterApplied){
			this.getLatestProducts({});
		}else{
			this.getLatestProducts(filterApplied);
		}

  	}


 	sortChange(value:number){

 	}
	//common method to add product to cart/whishlist
	addToCart(data:object, type:number){
		let accessToken = this.local.retrieve('accessToken');
    
		if (!accessToken) {
			this.router.navigateByUrl('/login');
		}
		let params = {};
		params['saveType'] = (type==2?'cart':"wislist");
		params['productId'] = data['_id'];
    	params['variantId'] = data['productVariant'][0]['_id'];
		params['quantity'] = 1;

		this.HomeService.addProductToCartWishList(params).subscribe((payload) => {
			var response = JSON.parse(JSON.stringify(payload));
			
			if(!response.error){
				//console.log("response : ", response);
				this.toastr.success(response.message);
			}else{
				this.toastr.error(response.message);
			}
			
		}, (error) => {
			// this.toastr.error(error.status + " : " + error.statusText);
			console.log(error)
		});
	}

	openProductDetail(id:any,title:any){
    	this.router.navigate(['/productDetails'], { queryParams: { id: id ,title:title} });
  	}


  	getLatestProducts(params:any) {
		this.productService.getFilterProducts(params).subscribe((response:any) => {
			if(response && response.data && response.data.length){
				this.productListArray = response.data;
				this.completeProductList = response.data;
				console.log( this.productListArray);
					}else{
				this.toastr.success(response.message);
			}

		},(error:any) => {
			console.log(error);
			this.toastr.error(error.status + " : " + error.statusText);
		})
  	}
    getBrandName(){
      this.productService.getAllBrand().subscribe((response:any) => {
        console.log(response)
			if(response && response.data && response.data.length){
			this.BrandList = response.data;
			}else{
			this.toastr.success(response.message);

			}

		},(error:any) => {
			console.log(error);
			this.toastr.error(error.status + " : " + error.statusText);
		})
    }

	sliderEvent(){
		this.productListArray = []

		for(let item in this.completeProductList){
			if(this.completeProductList[item].productVariant){
				let localProduct = this.completeProductList[item].productVariant.filter(obj=>obj.yourPrice<this.sliderValue[1] && obj.yourPrice>this.sliderValue[0]);
				this.completeProductList[item].productVariant = localProduct

			
				// for(let key in this.completeProductList[item].productVariant){
				// 	if(this.completeProductList[item].productVariant[key].yourPrice < this.sliderValue[1]){
				// 		this.productListArray.push(this.completeProductList[item].productVariant[key])
				// 		console.log("mylist"+this.productListArray )

				// 	}
				// }
			}if(this.completeProductList[item].productVariant.length!=0){
				this.productListArray.push(this.completeProductList[item])
			}
			
		   console.log(this.productListArray)
		}

	}
}

