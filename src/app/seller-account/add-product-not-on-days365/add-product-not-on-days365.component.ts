import { SellerAccountService } from './../../services/seller-account.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators} from "@angular/forms";
import { take, takeUntil } from 'rxjs/operators';
import { JsonObject } from '@angular-devkit/core';
import{Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';
import { VendorDetailsService } from 'app/services/vendor-details.service';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-add-product-not-on-days365',
  templateUrl: './add-product-not-on-days365.component.html',
  styleUrls: ['./add-product-not-on-days365.component.css']
})
export class AddProductNotOnDays365Component implements OnInit {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  productCategoryForm:FormGroup;
  searchCategoryForm: FormGroup;
  selectCategory:string="Departments";
  Str:boolean=true;
  Str1:boolean=true;
  formdata:any;
  searchDataArr:any=[];
  vendorData;
  // disableAnchor:boolean=false;
  browse:any[];
  BrowseCategory:any[];
  parentCategories:any=[];
  constructor(
    private formBuilder:FormBuilder, 
    private sellerAccountService:SellerAccountService,
    private router:Router,
    private local: LocalStorageService,
    private vendorDetailsService: VendorDetailsService,
    
    private toastr: ToastrService) { 
      let accessToken = this.local.retrieve('accessToken');
      let type = this.local.retrieve('type');
      //this.sellerName = this.local.retrieve('fullname');
      if (!accessToken || type !== 'vendor') {
        this.router.navigateByUrl('/');
      }
    this.getCategories();
  }

  ngOnInit(): void {
    
    this.productCategoryForm= this.formBuilder.group(
      {
        browse:null,
        CategoryName:null,
      }
    )

    this.formdata = this.formBuilder.group(
      {
        CategoryName:[null, [Validators.required]]
      })
    
  }


  getCategories(parentId = '') {
    let params: JsonObject = { id: parentId };
    this.BrowseCategory=[];
    this.sellerAccountService.getBrowseCategory(params).subscribe(
      (response) => {

        if(response.data.categories.length==0)
        {
         
          this.getCategories("6087df08d80dde18cb1a4036")
          

          alert("No subcategory found")

        }

        if(response.data.parent.name=="Departments"){
         this.parentCategories.push("");
        }else{
          this.parentCategories.push(response.data.parent.name);
        }
        
        this.BrowseCategory= response.data.categories;
        console.log("response.data.categories.length",response.data);
        // if(response.data.categories.length==1){
        //   this.Str =false;
        // }else{
        //   this.Str =true;
        // }
      },(error:any) => {
        this.toastr.error(error.status + " : " + error.statusText);
      }
    )
  }

  selectCategories( id: string) {
     this.getCategories(id);
  }

  onSelectCategoryClick(a:HTMLInputElement, b:HTMLInputElement, c:HTMLInputElement, d:HTMLInputElement){
    this.selectCategory=(<HTMLInputElement>a).textContent + ">" + (<HTMLInputElement>b).textContent + ">" + (<HTMLInputElement>c).textContent + ">"+ (<HTMLInputElement>d).textContent;
  }

  onSelectCategoriesClick(id:string){
    this.router.navigate(['/select-category-form'], { queryParams: { id: id } });
  }

  onClickSubmit(data:any) {
    
    if(this.formdata.valid){
      this.sellerAccountService.searchForCategory(this.formdata.value).subscribe(
        (response:any) => {
          console.log(response);
          if(response.message =="Category Not exists"){
            this.searchDataArr = response.data;
            this.toastr.success(response.message);
          }else{
            this.searchDataArr = response.data;
          }
        },
        (error:any) => {
          this.toastr.error(error.status + " : " + error.statusText);
        }
        
      )
    }
  }
}