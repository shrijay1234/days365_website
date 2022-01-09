import { SellerAccountService } from './../../services/seller-account.service';
import { Component, OnInit, ElementRef, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators,AbstractControl} from "@angular/forms";
import { ActivatedRoute,Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-select-cateogry-form',
  templateUrl: './select-cateogry-form.component.html',
  styleUrls: ['./select-cateogry-form.component.css']
})
export class SelectCateogryFormComponent implements OnInit {

	private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  CountryName:any[];
  ProductTaxCode:any[];
  brandArray:any[];

  selectCategoryForm: FormGroup;
  submitted:boolean= false;
  disabled:boolean=false;
  errorMessage:string="";
  disabledAddMore:boolean=false;
  errorMessageBullet:string="";
  disabledAddSearch:boolean=false;
  errorMessageTerm:string="";
  disabledAudience:boolean=false;
  errorMessageAudience:string="";
  imagesUploaded:number=0;
  enableCharges:boolean=false;
  chargeAmount:number;
  categoryId:string="";

  
  constructor(
    private formBuilder:FormBuilder, 
    private sellerAccountService:SellerAccountService,
    private activatedRoute: ActivatedRoute,
    private local: LocalStorageService,
    private router:Router,
    private toastr: ToastrService) {
      let accessToken = this.local.retrieve('accessToken');
		  let type = this.local.retrieve('type');
      if (!accessToken || type !== 'vendor') {
        this.router.navigateByUrl('/');
      }

   }

  ngOnInit(): void {

    this.sellerAccountService.getCountryName().subscribe(
      (response)=>{
        //console.log(response.data);
        this.CountryName=response.data;
      }
    );
    this.getProductTaxCodes();
    var obj ={"status":["Active"],"type":"seller"}; 
    this.sellerAccountService.getBrands(obj).subscribe(
      (response:any)=>{
        this.brandArray = response.data;
      }
    );

    this.categoryId = this.activatedRoute.snapshot.queryParamMap.get("id");
 
    this.selectCategoryForm= this.formBuilder.group(
      {
        vitalInfo:this.formBuilder.group({
          title: [null, [Validators.required]],
          categoryId:this.categoryId,
          countryOfOrigin:[null, [Validators.required]],
          manufacturer:[null, [Validators.required]],
          brandName:[null, [Validators.required]],
          minimumRecommendedAge:[null, [Validators.required, Validators.min(6)]],
          isProductExpirable:[null, [Validators.required]],
          isProductFeatured:[null, [Validators.required]]
        }),

        offer:this.formBuilder.group({
          condition: [null, [Validators.required]],
          conditionNote:[""],
          productTaxCode:[null],
          handlingPeriod:[null, [Validators.required]],
          AvailableOffer:[""]
        }),

        description:this.formBuilder.group({
          productDescription: [null, [Validators.required]],
          legalDisclaimer:[""],
          bulletPoint:[""],
          howToUse:[""],
          Ingredients:[""],
          keyFeatures:this.formBuilder.array([this.formBuilder.control(null)]),
        }),

        keywords:this.formBuilder.group({
          searchTermsArr:this.formBuilder.array([this.formBuilder.control(null)]),
          targetAudienceArr:this.formBuilder.array([this.formBuilder.control(null)]),
          shippingCharges: [null, [Validators.required]],
          shippingChargesAmt:[null]
        })
      }
    )

    
  }
   
  getProductTaxCodes() {
		this.sellerAccountService.getProductTaxCodes()
			.pipe(takeUntil(this.destroyed$))
			.subscribe((payload) => {
				var response = JSON.parse(JSON.stringify(payload));
				if (!response.error) {
					this.ProductTaxCode = response.data.utility_data;
				}
			}, (error) => {
				// this.toastr.error(error.status + " : " + error.statusText);
			});
	}
  onAddBulletClick(){
    var addedBulletPointForm= new FormGroup({
      addedBullet:new FormControl(null)
      }
    );
    (<FormArray>this.selectCategoryForm.get("description.addedBulletPoint")).push(addedBulletPointForm);
    if((<FormArray>this.selectCategoryForm.get("description.addedBulletPoint")).controls.length > 3){
      this.disabledAddMore=true;
      this.errorMessageBullet="You can not add more than 5 Bullet Points.";
    }
  }

  getSearchTermFormControls(): AbstractControl[] {
    return (<FormArray> this.selectCategoryForm.get('keywords.searchTermsArr')).controls
  }

  onAddSearchTermClick(){
    (this.selectCategoryForm.get('keywords.searchTermsArr') as FormArray).push(
      this.formBuilder.control(null)
    );
  }

  onRemoveSearchTermClick(index:any){
    (this.selectCategoryForm.get('keywords.searchTermsArr') as FormArray).removeAt(index);
  }

  getTargetAudienceFormControls(): AbstractControl[] {
    return (<FormArray> this.selectCategoryForm.get('keywords.targetAudienceArr')).controls
  }

  onAddTargetAudienceClick(){
    (this.selectCategoryForm.get('keywords.targetAudienceArr') as FormArray).push(
      this.formBuilder.control(null)
    );
  }

  onRemoveTargetAudienceClick(index:number){
    (this.selectCategoryForm.get('keywords.targetAudienceArr') as FormArray).removeAt(index);
  }

  getKeyProductFeatures(): AbstractControl[] {
    return (<FormArray> this.selectCategoryForm.get('description.keyFeatures')).controls
  }

  onAddKeyFeature(){
    (this.selectCategoryForm.get('description.keyFeatures') as FormArray).push(
      this.formBuilder.control(null)
    );
  }

  onRemovekeyFeatures(index:number){
    (this.selectCategoryForm.get('description.keyFeatures') as FormArray).removeAt(index);
  }

  

  onChargesClick(){
    this.enableCharges=true;
    this.chargeAmount=100;
  }

  onFreeClick(){
    this.enableCharges=false;
  }

  onSubmitClick()
  {
    this.submitted = true;
    if(this.selectCategoryForm.valid){
      let brandData = this.selectCategoryForm.value.vitalInfo.brandName.split("@@");
      this.selectCategoryForm.value.vitalInfo.brandName = brandData[0];
      this.selectCategoryForm.value.vitalInfo.percentageOnBrand = brandData[1];

      if(this.selectCategoryForm.value.offer.productTaxCode){
        let taxData = this.selectCategoryForm.value.offer.productTaxCode.split("@");
        this.selectCategoryForm.value.offer.productTaxCode = taxData[0];
        this.selectCategoryForm.value.offer.taxCodePercentage = taxData[1];
      }
      // console.log(this.selectCategoryForm.value);
      // return
      this.sellerAccountService.registerProductNotOnDays365(this.selectCategoryForm.value).subscribe(
        (response:any) => {

          if(response.message =="Duplicate Data Founded"){
            this.toastr.success(response.message);
          }else if(response.message =="Successfully Added Product"){
            this.toastr.success(response.message);
            this.router.navigateByUrl('/seller-home');
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