import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserInfo } from 'os';
import { switchAll } from 'rxjs/operators';
import { LoginService } from '../services/login.service'
import { UserDetail } from './my-profile.component.class';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  userDetail = new UserDetail();



  editModeToggle = false;
  constructor(private formBuilder: FormBuilder, private loginService: LoginService, private route:Router) { }

  edit(userDetail: any) {
    debugger
    this.editModeToggle = true;
    //this.oldItemData = this.item;
    this.registerForm.get("fullname").setValue(this.userDetail.fullname);
    this.registerForm.get("number").setValue(this.userDetail.number);
    this.registerForm.get("email").setValue(this.userDetail.email);


    console.log('------ edit activate -------')

  }
  back(){
    this.editModeToggle = false;
  }
  // saveChanges(item: any) {
  //   // some stuff happens
  //   this.editModeToggle = false;
  //   console.log('------ save -------')
  //   console.log('old item:', this.oldItemData.name);
  //   console.log('item:', this.item.name);
  // }

  cancelEdit() {
    this.editModeToggle = false;

  }
getUserDetails(){
  this.loginService.getUserDetails().subscribe((res) => {
    console.log(res.data);
    this.userDetail.fullname = res.data.fullname
    this.userDetail.number = res.data.mobile_number.number
    this.userDetail.email = res.data.email
  })
  
}


  ngOnInit(): void {
   this.getUserDetails();
    this.registerForm = this.formBuilder.group({

      fullname: [this.userDetail.fullname, Validators.required],
      //lastName: ['', Validators.required],
      email: [this.userDetail.email, [Validators.required, Validators.email]],
     // password: ['', [Validators.required, Validators.minLength(6)]],
      number: [this.userDetail.number, [Validators.required, Validators.minLength(10)]],
      // address:['', [Validators.required, Validators.minLength(5)]],
      //     acceptTerms: [false, Validators.requiredTrue]
    });
  }
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    let details = this.registerForm.value
 console.log(details)
    this.loginService.updateUserProfile(details).subscribe((res) => {
      console.log(res);
      if(res.message =="Successfully updated user details"){
      Swal.fire("Profile updated successfully")
      }
      this.getUserDetails();
    })
    // display form values on success
  }


}

