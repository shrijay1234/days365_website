
import {FormControl, Validators, FormBuilder, FormGroup,} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { JsonObject } from '@angular-devkit/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute,Router } from '@angular/router';
import { HomeService } from './../../services/home.service';
import {MatDialog} from '@angular/material/dialog';
import { LocalStorageService } from 'ngx-webstorage';
import { MatSelectChange } from "@angular/material/select";

declare var $:any;


@Component({
  selector: 'app-home13',
  templateUrl: './home13.component.html',
  styleUrls: ['./home13.component.css']
})
export class Home13Component implements OnInit {

  
 inputnumber = 0;  
 plus(){
   this.inputnumber = this.inputnumber+1;
 }

 minus(){
   if (this.inputnumber ! = 0){
    this.inputnumber = this.inputnumber-1;
   }
 }
  productVariants: Array<any> = [];
  productDetailsForm: FormGroup;
  submitted = false;
  title:string;
  formdata:any;
  productSizeVariant: Array<any> = [];
  selectedFlavour;
  frontImg:string;
  backImg:string;
  expiryImg:string;
  sealImg:string;
  MRPImg:string;
  selectImgOnClick:string;
  flavour:string;
  MRP:string="0";
  yourPrice:string="0";
  youSave:number=0;
  expiryDate:string;
  foodType : string;
  keyFeature:string


  constructor(private formBuilder: FormBuilder, 
    private toastr: ToastrService,
    private router:Router,
    private activatedRoute: ActivatedRoute,
    private HomeService:HomeService,
    private local: LocalStorageService) { 
    
  }

  ngOnInit(): void {

    this.productDetailsForm = this.formBuilder.group({
      flavour: ['', Validators.required],
      size: ['', Validators.required],
    });
    
    $('.owl-carousel').owlCarousel({
      loop:true,
      margin:10,
      responsiveClass:true,
      responsive:{
            0:{
              items:1,
              nav:true
            },360:{
              items:1,
              nav:false
            },640:{
              items:2,
              nav:false
            },768:{
              items:3,
              nav:false
            },1024:{
             items:3,
             nav:false
            },1050:{
              items:4,
              nav:true,
              loop:false
            }
          }
    });
    this.getProductDetails(this.activatedRoute.snapshot.queryParamMap.get("id"));
    this.title = this.activatedRoute.snapshot.queryParamMap.get("title");
    }

getProductDetails(id:any){

  let params: JsonObject = { id: id};
  this.HomeService.getProductDetails(params)
    .subscribe((payload) => {
      var response = JSON.parse(JSON.stringify(payload));
        console.log("Product list" , response.data);
      if (!response.error) {
        
        if(response.data && response.data[0] && response.data[0].MainImg){
          this.selectImgOnClick = response.data[0].MainImg;
        }

        if(response.data && response.data[0] && response.data[0].MainImg){
          this.frontImg = response.data[0].MainImg;
        }
        if(response.data && response.data[0] && response.data[0].backImg){
          this.backImg = response.data[0].backImg;
        }

        if(response.data && response.data[0] && response.data[0].expiryDateImg){
          this.expiryImg = response.data[0].expiryDateImg;
        }

        if(response.data && response.data[0] && response.data[0].productSealImg){
          this.sealImg = response.data[0].productSealImg;
        }

        if(response.data && response.data[0] && response.data[0].importerMRPImg){
          this.MRPImg = response.data[0].importerMRPImg;
        }
      
        if(response.data && response.data[0] && response.data[0].VegNonVegProduct){
          this.foodType = response.data[0].VegNonVegProduct;
        }

        if(response.data && response.data[0] && response.data[0].keyFeature){
          this.keyFeature = response.data[0].keyFeature;
        }

        //keyFeature

        this.productVariants = response.data;
      } else {
        this.toastr.error(response.message);
      }
    }, (error) => {
      this.toastr.error(error.status + " : " + error.statusText);
    });

}
get f() {
  return this.productDetailsForm.controls;
}

onSubmit() {
  this.submitted = true;

  // stop here if form is invalid
  if (this.productDetailsForm.invalid) {
    return;
  }

  // display form values on success
  alert(
    'SUCCESS!! :-)\n\n' + JSON.stringify(this.productDetailsForm.value, null, 4)
  );
}

onReset() {
  this.submitted = false;
  this.productDetailsForm.reset();
}

onOptionsSelected() {
  this.productSizeVariant = this.selectedFlavour.size;
  this.flavour = this.selectedFlavour._id;
}
onSizeOptionsSelected(e:any){
  var obj ={"size":e.target.value,"flavour":this.flavour,"title":this.title};
  this.HomeService.getProductSizeVariants(obj).subscribe(
    (response:any) => {
      if(response.message =="No Record Found."){
        this.toastr.success(response.message);
      }else{
        console.log(response.data);
        if(response.data && response.data[0] && response.data[0].MainImg){
          this.selectImgOnClick = response.data[0].MainImg;
        }

        if(response.data && response.data[0] && response.data[0].MainImg){
          this.frontImg = response.data[0].MainImg;
        }
        if(response.data && response.data[0] && response.data[0].backImg){
          this.backImg = response.data[0].backImg;
        }

        if(response.data && response.data[0] && response.data[0].expiryDateImg){
          this.expiryImg = response.data[0].expiryDateImg;
        }

        if(response.data && response.data[0] && response.data[0].productSealImg){
          this.sealImg = response.data[0].productSealImg;
        }

        if(response.data && response.data[0] && response.data[0].importerMRPImg){
          this.MRPImg = response.data[0].importerMRPImg;
        }

        if(response.data && response.data[0] && response.data[0].maximumRetailPrice){
          this.MRP = response.data[0].maximumRetailPrice;
        }

        if(response.data && response.data[0] && response.data[0].yourPrice){
          this.yourPrice = response.data[0].yourPrice;
          this.youSave = Number(this.MRP) -  Number(this.yourPrice);
        }

        if(response.data && response.data[0] && response.data[0].expiryDate){
          this.expiryDate = response.data[0].expiryDate;
        }
        if(response.data && response.data[0] && response.data[0].VegNonVegProduct){
          this.foodType = response.data[0].VegNonVegProduct;
        }
        

      }
    }),
    (error:any) => {
      this.router.navigate(['/'])
      ;
      this.toastr.error(error.status + " : " + error.statusText);
    }
}

onSelectImg(url:any){
  this.selectImgOnClick = url;
}

}

