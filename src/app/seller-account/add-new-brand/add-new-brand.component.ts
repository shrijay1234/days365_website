import { SellerAccountService } from './../../services/seller-account.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators} from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'app-add-new-brand',
  templateUrl: './add-new-brand.component.html',
  styleUrls: ['./add-new-brand.component.css']
})
export class AddNewBrandComponent implements OnInit {
  selectedFile:File = null;
  newBrandForm:FormGroup;
  submitted:boolean= false;
  disabled:boolean=false;
  errorMessage:string="";
  Categories:any[];
  registerError:string= null;
  file: any = null;
  sizeExceed = '';
  
  
  

  constructor(private formBuilder:FormBuilder,
     private sellerAccountService:SellerAccountService, 
     private http:HttpClient,
     private toastr: ToastrService,
     private router:Router) { }

  ngOnInit(): void {
    this.newBrandForm= this.formBuilder.group(
      {
        brandName: [null, [Validators.required, Validators.maxLength(15)]],
        // registrationNo:[null,[Validators.required]],
        brandWebsite:null,
        // Percentage:[null,[Validators.required]],
        category:[null,[Validators.required]],
        can_reuse_by_other:[null,[Validators.required]],
        image:[null,[Validators.required]]
      }
      
    )
  

    this.sellerAccountService.getCategories().subscribe(
      (response:any)=>{
        this.Categories=response.data.categories;
      }
    );

  }

   /**
   *  Detect filechange event for signature upload
   */

    fileChange(event: any) {
      this.file = null;
      this.sizeExceed = '';
      let fileList: FileList = event.target.files;
      if (fileList.length > 0) {
        let type = fileList[0].type;
        let size = Math.round((fileList[0].size) / 1024);
        if (type != "image/jpeg" && type != "image/png") {
          this.sizeExceed = 'Image should be in .jpeg or .png format.';
          alert("Image should be in .jpeg or .png format.")
        }
        else {
          if (size > 5000) {
            this.sizeExceed = 'File too Big, please select a file less than 5000KB.';
            alert("File too Big, please select a file less than 5000KB.")
          }
          else {
            this.file = fileList[0];

          }
        }
      }
    }
 
  
  onSubmitClick()
  {
    
    this.submitted = true;
    const formData:FormData =new FormData();
    let brandform=this.newBrandForm.getRawValue();
    formData.append('brandName', brandform.brandName);
    // formData.append('registrationNo', brandform.registrationNo);
    // formData.append('Percentage', brandform.Percentage);
    formData.append('brandWebsite', brandform.brandWebsite);
    formData.append('category', brandform.category);
    formData.append('can_reuse_by_other', brandform.can_reuse_by_other)
   
    if (this.file) {
      formData.append('image', this.file);
    }
    
   
    if(this.newBrandForm.valid){
      
      this.sellerAccountService.Register(formData).subscribe(
        (response:any) => {

          if(response.message =="Similar brand already exists."){

            this.toastr.success(response.message);
          }else if(response.message =="Successfully Added Brand"){
            
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
