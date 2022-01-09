import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';
import { HomeService } from 'app/services/home.service';

@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.component.html',
  styleUrls: ['./my-cart.component.css']
})
export class MyCartComponent implements OnInit {
  items:any =[];
  itemsCount:number=0;
  total:number=0;
  newitems:any = [];
  constructor(
    private local : LocalStorageService,
    private router : Router,
    private productService: HomeService
  ) { 
    const accessToken = this.local.retrieve('accessToken');
		if (accessToken==null || accessToken=='') {
			this.router.navigate(['/login']);
		}
  }

  ngOnInit(): void {
    this.getCartItems();
  }

  getCartItems(){
    let params= {};
    params['saveType'] = 'cart';
    this.productService.getCartItems(params).subscribe((payload) => {
			var response = JSON.parse(JSON.stringify(payload));
			
			if(!response.error){
				this.items = response.data;
        this.itemsCount = response.data.length;
        this.newitems=response.data;
        for (let i of this.items) {
						
          for (let j of i.cartData.productVariant) {
            
            if(i.varientId==j._id){
              this.total+=j.yourPrice;
            }
          }
          }
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



}
