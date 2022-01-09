import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';
import { HomeService } from 'app/services/home.service';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css']
})
export class WishListComponent implements OnInit {
  items:any = [];
  itemsCount:number=0;
  newitems:any = [];
  constructor(
    private router:Router,
    private productService : HomeService,
    private local : LocalStorageService
    
  ) { 
    const accessToken = this.local.retrieve('accessToken');
		if (accessToken==null || accessToken=='') {
			this.router.navigate(['/login']);
		}
  }

  ngOnInit(): void {    
    this.getWishListItems();
  }

  getWishListItems(){
    let params= {};
    params['saveType'] = 'wislist';
    this.productService.getCartItems(params).subscribe((payload) => {
			var response = JSON.parse(JSON.stringify(payload));
			
			if(!response.error){
				this.items = response.data;
        this.itemsCount = this.items.length;
        this.newitems=response.data;
			
			}

      console.log("items", this.items)
			//console.log("products : ", this.products);
		}, (error) => {
			// this.toastr.error(error.status + " : " + error.statusText);
			console.log(error)
		});
  }


  deleteToCart(data:object){
		let accessToken = this.local.retrieve('accessToken');
    
    if (!accessToken) {
      this.router.navigateByUrl('/login');
    }
		let params = {};
		params['cartid'] = data['_id'];
    console.log(data)

		this.productService.deleteProductToCartWishList(params).subscribe((payload) => {
			var response = JSON.parse(JSON.stringify(payload));
			
			if(!response.error){
				console.log("response : ", response);
				window.location.reload();
			
			}else{
			
			}
			
		}, (error) => {
			// this.toastr.error(error.status + " : " + error.statusText);
			console.log(error)
		});
	}


	wishToCart(data:object){
		let accessToken = this.local.retrieve('accessToken');
    
    if (!accessToken) {
      this.router.navigateByUrl('/login');
    }
		let params = {};
		params['cartid'] = data['_id'];
  

		this.productService.covertProductToCartWishList(params).subscribe((payload) => {
			var response = JSON.parse(JSON.stringify(payload));
			
			if(!response.error){
				console.log("response : ", response);
				window.location.reload();
			}else{
			
			}
			
		}, (error) => {
			// this.toastr.error(error.status + " : " + error.statusText);
			console.log(error)
		});
	}

}
