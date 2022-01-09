import { Component, OnInit } from '@angular/core';
import {FormControl, Validators,FormBuilder, FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { SellerAccountService } from './../../services/seller-account.service';
import { ToastrService } from 'ngx-toastr';
import { JsonObject } from '@angular-devkit/core';
import { ActivatedRoute,Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import 'rxjs/add/operator/filter';
import * as $ from 'jquery';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  selected: Date | null;
  foods: Food[] = [
    {value: 'GTIN-0', viewValue: 'GTIN'},
    {value: 'EAN-1', viewValue: 'EAN'},
    {value: 'GCID-2', viewValue: 'GCID'},
    {value: 'ISBN-3', viewValue: 'ISBN'},
    {value: 'UPC-2', viewValue: 'UPC'}
  ];
  $: any;
  name = 'Angular 6';
  addVariantForm: FormGroup;
  arr: FormArray;
  submitted:boolean= false;
  productId:string="";
  SKUId:string;
  VegNonVegProduct:string;
  size:string;
  stock:number;
  title:string="";
  fileName = '';
  file: any = null;
  sizeExceed = '';
  yourPrice:number;
  spinner = false;
  imageSrc: string;
  expiryDate_Img : File;
  expiryDateImgArr = [];
  removeButton:boolean=true;
  imgUrlHistoryArr = [];

  constructor(
    private fb: FormBuilder,
    private sellerAccountService:SellerAccountService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private local: LocalStorageService,
    private router:Router,
  ) {
    
    let accessToken = this.local.retrieve('accessToken');
    let type = this.local.retrieve('type');
    if (!accessToken || type !== 'vendor') {
      this.router.navigateByUrl('/');
    }
  }
  
  ngOnInit() {
    
    this.addVariantForm = this.fb.group({
      arr: this.fb.array([this.createItem()])
    })
    this.productId = this.activatedRoute.snapshot.queryParamMap.get("id");
    this.title = this.activatedRoute.snapshot.queryParamMap.get("title");
    
    this.getProductVariant(this.productId);
  }

  getProductVariant(id:string) {
    let params: JsonObject = { id: id};
    this.sellerAccountService.getProductVariant(params)
      .subscribe((payload) => {
        var response = JSON.parse(JSON.stringify(payload));
      
        if (!response.error) {
          console.log("response",response);
         if(response && response.data && response.data.productVariant && response.data.productVariant.length){
          var len=response.data.productVariant.length;
           for(var i=1;i<=len;i++){

            if (i!=len) {
              this.addProductVariant()
            }
            var index =i-1;
            let x = (<FormArray>this.addVariantForm.controls['arr']);
            x.at(index).patchValue(response.data.productVariant[index]);
           
           }
         }
        } else {
          this.toastr.error(response.message);
        }
      }, (error) => {
        this.toastr.error(error.status + " : " + error.statusText);
      });
  }
  createItem() {
    return this.fb.group({
      productId:  ['', [Validators.required,]],
      productIdType:  ['', [Validators.required]],
      SKUId: ['',[Validators.required,]],
      VegNonVegProduct: ['',[Validators.required,]],
      size: ['',[Validators.required,]],
      stock: ['',[Validators.required,]],
      yourPrice: ['',[Validators.required,]],
      title:[''],
      //offerPrice:[''],
      maximumRetailPrice: [''],
      importerMRP_Img: [''],
      expiryDate_Img: [''],
      productSeal_Img: [''],
      MainImg: [''],
      product_Img1: [''],
      flavour:[''],
      expiryDate:[''],
      // product_Img2: [''],
      // product_Img3: [''],

      length: [''],
      breadth: [''],
      height: [''],
      weight:[''],
      source_pin:['']





    
    })
  }
  get f() { return this.addVariantForm.controls; }
  addProductVariant(){
    this.arr = this.addVariantForm.get('arr') as FormArray;
    this.arr.push(this.createItem());
    this.removeButton = false;
  }

  removeProductVariant(index) {
    (this.addVariantForm.get('arr') as FormArray).removeAt(index);
  }

  onSubmitData() {
    console.log("this.addVariantForm.value.arr",this.addVariantForm.value.arr);
    this.submitted = true;
    if(this.addVariantForm.valid){

      let obj: JsonObject = {id:this.productId, productVariant : this.addVariantForm.value.arr,urlHistory:this.imgUrlHistoryArr};
      this.sellerAccountService.addProductVariant(obj).subscribe(
        (response:any) => {

          console.log(response);
          if(response.message =="No Record Found."){
            this.toastr.success(response.message);
          }else if(response.message =="Product Varient  has been Added"){
            this.toastr.success(response.message);
            this.router.navigateByUrl('/viewProductsForAddVariants');
            this.imgUrlHistoryArr.length =0;
          }else{
            this.toastr.success(response.message);
          }
        },
        (error:any) => {
          console.log(error);
          this.toastr.error(error.status + " : " + error.statusText);
        }
        
      )
    }
  }
  
   fileUploadOnSelect(event: any,index:any,controlName:any) {
    var target = event.target || event.srcElement || event.currentTarget;
    var idAttr = target.attributes.id;
    var id = idAttr.nodeValue;
    id = id+"img";
    console.log("Dynamic id created......",id);
    this.file = null;
    this.sizeExceed = '';
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let type = fileList[0].type;
      let size = Math.round((fileList[0].size) / 1024);
      if (type != "image/jpeg" && type != "image/png") {
        this.sizeExceed = 'Image should be in .jpeg or .png format.';
      }
      else {
        if (size > 500) {
          this.sizeExceed = 'File too Big, please select a file less than 500KB.';
        }
        else {
          this.file = fileList[0];
          const formData = new FormData();
          formData.append("image", this.file);
          //console.log("indexxxxxxxxxxxxxxxxx",index);

          this.sellerAccountService.uploadFile(formData).subscribe(
            (response:any) => {
            
              if(response.message == 'Successfully uploaded file/Image'){
                //this.imageSrc =response.ImageUrl;
                this.imgUrlHistoryArr.push(response.ImageUrl);
                //$("#"+id).val(response.ImageUrl);
                console.log("response.ImageUrl...",response.ImageUrl);
                let x = (<FormArray>this.addVariantForm.controls['arr']);
                let s = {};
               s[controlName]=response.ImageUrl
               s["title"]=this.title;
                x.at(index).patchValue(s);
              }else{
                this.toastr.success(response.message);
              }
            },
            (error:any) => {
              console.log(error);
              this.toastr.error(error.status + " : " + error.statusText);
            }
          )
          
        }
      }
    }
  }
 
}
