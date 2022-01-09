import { Component, OnInit } from '@angular/core';
import { SellerAccountService } from './../../services/seller-account.service';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators} from "@angular/forms";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-seller-home',
  templateUrl: './seller-home.component.html',
  styleUrls: ['./seller-home.component.css']
})
export class SellerHomeComponent implements OnInit {

  constructor(private formBuilder:FormBuilder, private sellerAccountService:SellerAccountService,private toastr: ToastrService) { }
  formdata:any;
  searchDataArr:any=[];
  ngOnInit(): void {

    this.formdata = this.formBuilder.group(
    {
      searchValue:[null, [Validators.required]]
    })

  }

  onSubmit(data:any) {

    if(this.formdata.valid){
      this.sellerAccountService.searchAProduct(this.formdata.value).subscribe(
        (response:any) => {
          console.log(response);
          if(response.message =="No Record Found"){
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

  onSelectProductClick(){
    
  }

}
