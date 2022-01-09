declare var $: any;
import { Component, OnInit, OnDestroy, HostListener, Output, EventEmitter } from '@angular/core';
import { LoginService } from 'app/services/login.service';
import { ProductService } from 'app/services/product.service';
import { HomeService } from './../../services/home.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-front-header',
  templateUrl: './front-header.component.html',
  styleUrls: ['./front-header.component.css']
})
export class FrontHeaderComponent implements OnInit {
  @Output() newCategoryEvent = new EventEmitter<string>();
  @Output() newBrandEvent = new EventEmitter<string>();
  @Output() newMainCatEvent = new EventEmitter<string>();


  hidden = false
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  isLogin;
  isVendor;
  selectedBrand = '';
  selectedCategory = '';
  categories = [];
  parentCat;
  brands = [];
  cartlist:number=0;
  wishlist:number=0;

  mainCategories = [];
  mainCat = '';
  searchTerm = '';

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private local: LocalStorageService,
    private loginService: LoginService,
    private productService: ProductService,
    private HomeService:HomeService

  ) {
    let token = this.local.retrieve("accessToken");
    let type = this.local.retrieve('type');
    this.isLogin = (token) ? true : false;
    this.isVendor = (type === 'vendor') ? true : false;
  }
  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  ngOnInit(): void {
    // this.getSubCategories("");
    // this.getActiveBrands();
    // this.getMainCategories();
    
if(this.isLogin){
  this.getCartItems();
  this.getWishItems();
}
  }


  getCartItems(){
    let params= {};
    params['saveType'] = 'cart';
    this.HomeService.getCartItems(params).subscribe((payload) => {
			var response = JSON.parse(JSON.stringify(payload));
			
			if(!response.error){
		
        this.cartlist = response.data.length;
        
        
          
          
			}
   
			//console.log("products : ", this.products);
		}, (error) => {
			  // this.toastr.error(error.status + " : " + error.statusText);
			  console.log(error)
		});
  }
  getWishItems(){
    let params= {};
    params['saveType'] = 'wislist';
    this.HomeService.getCartItems(params).subscribe((payload) => {
			var response = JSON.parse(JSON.stringify(payload));
			
			if(!response.error){
		
        this.wishlist = response.data.length;
        
        
          
          
			}
   
			//console.log("products : ", this.products);
		}, (error) => {
			  // this.toastr.error(error.status + " : " + error.statusText);
			  console.log(error)
		});
  }

  signOut() {
    this.loginService.logoutUser()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((payload) => {
        var response = JSON.parse(JSON.stringify(payload));
        // console.log("response", response);
        // if (!response.error) {
        //   this.toastr.success(response.message);
        // }
        // else {
        //   this.toastr.error(response.message);
        // }
        this.loginService.logout();
        this.isLogin = false;
      }, (error) => {
        this.toastr.error(error.status + " : " + error.statusText);
        this.loginService.logout();
        this.isLogin = false;
      });
  }




  getSubCategories(id: string) {
    this.categories = [];
    this.parentCat = null;
    this.productService.get2LevelCategories(id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((payload) => {
        let response = JSON.parse(JSON.stringify(payload));
        if (!response.error) {
          this.parentCat = response.data.parent;
          this.categories = response.data.categories;
        }
      }, (error) => {
        //Fine
      });
  }


  getActiveBrands() {
    this.brands = [];
    this.productService.getDistinctActiveBrands()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((payload) => {
        let response = JSON.parse(JSON.stringify(payload));
        if (!response.error) {
          this.brands = response.data.brands;
          this.brands.sort();
          // console.log(this.brands)
        }
      }, (error) => {
        //Fine
      });
  }


  brandChange(name: string) {
    this.selectedCategory = '';
    this.selectedBrand = name;
    this.getSubCategories("");
    this.newBrandEvent.emit(name);
  }

  categoryChange(name: string) {
    this.selectedCategory = name;
    this.selectedBrand = '';
    this.newCategoryEvent.emit(name);
  }


  mainCatSearch(category: string, searchTerm: string) {
    if (!searchTerm) {
      return;
    }
    let data = {
      category,
      searchTerm
    }
    this.newMainCatEvent.emit(JSON.stringify(data));
  }

  toHome() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/']);
    });
  }


  getMainCategories() {
    this.mainCategories = [];
    this.productService.getMainCategories()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((payload) => {
        let response = JSON.parse(JSON.stringify(payload));
        if (!response.error) {
          this.mainCategories = response.data.categories;
          console.log(this.mainCategories)
        }
      }, (error) => {
        //Fine
      });
  }

  @HostListener('window:beforeunload')
  async ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
