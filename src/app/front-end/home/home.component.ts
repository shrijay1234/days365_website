import { Component, OnInit, OnDestroy, HostListener, Input, ViewChild, ElementRef } from '@angular/core';
import { AccessTokenService } from 'app/services/access-token.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';
import { ReplaySubject } from 'rxjs';
import { takeUntil , startWith} from 'rxjs/operators';
import { HomeService } from './../../services/home.service';
import { JsonObject } from '@angular-devkit/core';
import { ProductService } from 'app/services/product.service';
import { MatPaginator } from '@angular/material/paginator';
import {Categories, Product} from './home.component.class';

declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  topfeatures ;
  latestProduct;
  productList  = new Array<Product>();
  simmilarProductList = new Array<Product>();
  options={ };
  @ViewChild ('latestProducts') latestProducts:ElementRef;
  recordsPerLoad=4;
  totalProducts=0;
  @ViewChild('TableOnePaginator') tableOnePaginator: MatPaginator;

  inputnumber = 0;  
  plus(){
    this.inputnumber = this.inputnumber+1;
  }
 
  minus(){
    if (this.inputnumber ! = 0){
     this.inputnumber = this.inputnumber-1;
    }
  }
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  currDiv: string = 'A';
  productListArray:any=[];
  bestsellerListArray:any=[];
  featuredListArray:any=[];
  categoryListArray:any[];
  categories = new Array<Categories>();
  ShowDiv(divVal: string) {
    this.currDiv = divVal;
  }

  	constructor(
		private router: Router,
		private toastr: ToastrService,
		private local: LocalStorageService,
		private accessTokenService: AccessTokenService,
		private HomeService:HomeService,
		private productService:ProductService,
  	) {
		let accessToken = this.local.retrieve('accessToken');
		let type = this.local.retrieve('type');
		if (!accessToken || type !== 'user') {
		this.router.navigateByUrl('/');
		}
  	}


  	ngOnInit(): void {
    	this.getAllCategories();
		this.getLatestProducts();
		this.getBestsellerProducts();
		this.getFeaturedProducts();
  	}

   	loadProduct(classname:string){
		$(document).ready(function () {
			$('.'+classname).owlCarousel('destroy'); 

			$('.'+classname).owlCarousel({
				loop: true,
				margin: 10,
				responsiveClass: true,
				responsive: {
					0: {
						items: 1,
						nav: true
					},
					360: {
						items: 1,
						nav: false
					},
					640: {
						items: 2,
						nav: false
					},
					768: {
						ms: 3,
						nav: false
					},
					1024: {
						items: 4,
						nav: false
					},

					1050: {
						items: 4,
						nav: true,
						loop: false
					}
				}
			});
		});
   	}

	getLatestProducts() {
		let params: JsonObject = {};
		params.limit=true;
		this.HomeService.getLatestProducts(params).subscribe((response:any) => {

			if(response && response.data && response.data.length){
				this.productListArray = response.data;
				this.loadProduct('owl-carousel1');
			}else{
				this.toastr.success(response.message);
				this.loadProduct('owl-carousel1');
			}

		},(error:any) => {
			console.log(error);
			this.toastr.error(error.status + " : " + error.statusText);
		})
  	}

	getBestsellerProducts() {
		let params: JsonObject = {};
		params.topfeaturedandotherfields = 'Bestseller';
		params.limit=true;
		this.HomeService.getFeaturedProducts(params).subscribe((response:any) => {

			if(response && response.data && response.data.length){
				this.bestsellerListArray = response.data;
				this.loadProduct('owl-carousel2');
			}else{
				this.toastr.success(response.message);
				this.loadProduct('owl-carousel2');
			}

		},(error:any) => {
			console.log(error);
			this.toastr.error(error.status + " : " + error.statusText);
		})
  	}

	getFeaturedProducts() {
		let params: JsonObject = {};
		params.topfeaturedandotherfields = 'topfeatures';
		params.limit=true;

		this.HomeService.getFeaturedProducts(params).subscribe((response:any) => {

			if(response && response.data && response.data.length){
				this.featuredListArray = response.data;
				this.loadProduct('owl-carousel3');
			}else{
				this.toastr.success(response.message);
				this.loadProduct('owl-carousel3');
			}

		},(error:any) => {
			console.log(error);
			this.toastr.error(error.status + " : " + error.statusText);
		})
  	}

	getCategoryList(parentId = '') {
		let params: JsonObject = {};
		this.HomeService.getCategoryList(params).subscribe(
		(response:any) => {
			// console.log("Category List Array" , response);
			if(response && response.data){
			//console.log(response.data.categories.length);
			this.categoryListArray = response.data.categories;
			
			}

		},(error:any) => {
			console.log(error);
			this.toastr.error(error.status + " : " + error.statusText);
		})
	}

  	openProductListings(type:string){
    	this.router.navigate(['/product'], { queryParams: { type: type} });
  	}
	
	openProductListingsBasedOnCategory(category:string){
		this.router.navigate(['/product'], { queryParams: { category: category} });
	}

    //common method to add product to cart/whishlist
	addToCart(data:object, type:number){


		if( type==2){
			let incvalue = document.getElementById("cartlistinc").innerText
		
		
		  let newincvalue = parseInt(incvalue) + 1
		  document.getElementById("cartlistinc").innerHTML= newincvalue.toString()
			}
			else{
			  let incvalue = document.getElementById("wishlistinc").innerText
		
		
			  let newincvalue = parseInt(incvalue) + 1
			  document.getElementById("wishlistinc").innerHTML= newincvalue.toString()
			}
			




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

	routeSearch(){
		this.options['page']=this.tableOnePaginator.pageIndex;
		this.options['size']=this.recordsPerLoad;
		this.getAllActiveProducts();
	}


	getAllActiveProducts(){
		this.productListArray = [];
		this.productService.getActiveProducts(this.options)
		.pipe(takeUntil(this.destroyed$))
		.subscribe((payload) => {
			let response = JSON.parse(JSON.stringify(payload));
			if (!response.error) {
			this.productListArray = response.data.products;
			this.totalProducts= response.data.maxRecords;
			}
			this.loadProduct('owl-carousel12');
			this.scrollToElement();
		}, (error) => {
			this.toastr.error(error.status + " : " + error.statusText);
		});
	}

	

	onMainCatSearch(data:string) {
		let search = JSON.parse(data);
		let title = '';
		let category = '';

		title = search.searchTerm;

		if(search.category){
			category=search.category;
		}
		this.router.navigate(['/product'], { queryParams: { category: category ,title:title} });
	
	}
	scrollToElement() {
		this.latestProducts.nativeElement.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
	}

	sortChange(value:number){
		let sort={};
		switch(value){
			case 0: 
			sort={};
			break;
			case 1:
			sort={
				price:1
			};
			break;
			case 2:
			sort={
				price:-1
			};
			break;
			case 3:
			sort={
				date:1
			};
			break;
			case 4:
			sort={
				date:-1
			};
			break;
			default:
			sort={};
		}
		this.options['sort']=JSON.stringify(sort);
		this.tableOnePaginator.pageIndex=0;
		this.routeSearch(); 
	}



ngAfterViewInit(){
  $('#carouselExampleCaptions').carousel()

}


  @HostListener('window:beforeunload')
  async ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

@HostListener('window:load')
  async popup() {
    document.getElementById('popup').click();
  }
getAllCategories(){
  this.HomeService.getAllCategories().subscribe((res)=>{
    this.categories = res.data.categories
  	//console.log(res);
  })
}

mySlideOptions={items: 1, dots: true, nav: true};
myCarouselOptions={items: 3, dots: true, nav: true};

}
