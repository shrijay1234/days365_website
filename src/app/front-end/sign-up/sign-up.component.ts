import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { RegistrationService } from 'app/services/registration.service';
import { LoginService } from 'app/services/login.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


export interface signUpData {
  fullname: String,
  mobile: {
    countryCode: String,
    number: String
  },
  password: String,
  email?: String,
  userType: String
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  registerForm: FormGroup;
  registerForm2: FormGroup;

  spinner = false;
  submitted = false;
  isUserActive = true;
  errorMessage = "";
  errorMessage2 = "";
  pass = false;
  step = 1;
  otp = "";

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private local: LocalStorageService,
    private registrationService: RegistrationService,
    private loginService: LoginService
  ) {
    if (this.local.retrieve('accessToken')) {
      this.router.navigateByUrl('/');
    }
    let id1 = this.local.retrieve('signupID');

    if (id1) {
      this.step = 2;
    }
    else {
      this.step = 1;
    }

  }

  ngOnInit(): void {
    this.createForm();
  }




  createForm() {
    this.registerForm = this.formBuilder.group({
      'fullname': new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]),
      'number': new FormControl('', [Validators.required, Validators.pattern(/^[6-9]{1}[0-9]{9}$/)]),
      'password': new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]),
      'confirmPassword': new FormControl('', [Validators.required, Validators.minLength(6)]),
      'email': new FormControl('', [Validators.pattern(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)])
    });
  }


  comparePasswords() {
    this.pass = this.registerForm.get('password').value === this.registerForm.get('confirmPassword').value;
  }


  get f() {
    return this.registerForm.controls;
  }




  onSubmit() {
    this.submitted = true;
    this.errorMessage = "";
    if (this.registerForm.invalid) {
      this.toastr.warning("Please fill all the required fileds");
      // console.log("form", this.registerForm.value);
      return;
    }
    this.comparePasswords();
    if (!this.pass) {
      return;
    }
    this.spinner = true;
    var signUpData: signUpData = {
      mobile: {
        countryCode: "+91",
        number: this.registerForm.get('number').value
      },
      fullname: this.registerForm.get('fullname').value,
      password: this.registerForm.get('password').value,
      userType: this.isUserActive ? "user" : "vendor"
    }
    if (this.registerForm.get('email').value !== "") {
      signUpData.email = this.registerForm.get('email').value;
    }
    this.submitted = false;
    this.registrationService.userSignup(signUpData)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((payload) => {
        this.spinner = false;
        var response = JSON.parse(JSON.stringify(payload));
        if (!response.error) {
          console.log("otp : ", response.data.otp);
          this.local.clear('signupID');
          this.local.store('signupID', response.data.id);
          this.toastr.success(response.message);
          // this.router.navigateByUrl('/');
          this.step = 2;
        }
        else {
          let isMobile = response.data.isMobile;
          let isVendor = response.data.isVendor;
          if (isMobile !== null) {
            this.errorMessage = "A " + (isVendor ? "'Seller Account'" : "'User Account'") + " already exists with the given " + (isMobile ? "Mobile Number." : "Email ID.");
          }
          else {
            this.errorMessage = response.message;
          }
          // this.toastr.error(response.message);
        }
      }, (error) => {
        this.toastr.error(error.status + " : " + error.statusText);
        // console.log(error)
        this.spinner = false;
      });
  }


  verifyUser() {
    this.errorMessage2 = '';
    if (!(/^[0-9]{6}$/.test(this.otp))) {
      // this.toastr.warning("Please enter a valid OTP");
      this.errorMessage2 = "Please enter a valid OTP";
      return;
    }
    var otpData = {
      otp: this.otp,
      id: this.local.retrieve('signupID')
    }
    this.spinner = true;
    this.registrationService.verifyUser(otpData)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((payload) => {
        var response = JSON.parse(JSON.stringify(payload));
        this.spinner = false;
        if (!response.error) {
          let user = response.data;
          this.loginService.setLocalStorage(user);
          this.toastr.success(response.message);
          this.router.navigateByUrl('/');
        }
        else {
          this.errorMessage2 = response.message;
        }
      }, (error) => {
        this.toastr.error(error.status + " : " + error.statusText);
        this.spinner = false;
      });
  }


  resendOTP() {
    let id = this.local.retrieve('signupID');
    if (!id) {
      return;
    }
    this.registrationService.resendOTP({ id: id })
      .pipe(takeUntil(this.destroyed$))
      .subscribe((payload) => {
        var response = JSON.parse(JSON.stringify(payload));
        console.log(response.data.otp);
        if (!response.error) {
          this.toastr.success(response.message);
        }
        else {
          this.toastr.error(response.message);
        }
      }, (error) => {
        this.toastr.error(error.status + " : " + error.statusText);
      });
  }



  resetForm() {
    this.local.clear();
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/sign-up']);
    });
  }


  resetVariables() {
    this.spinner = false;
    this.submitted = false;
    this.errorMessage = "";
    this.errorMessage2 = "";
    this.pass = false;
    this.step = 1;
    this.otp = "";
    this.local.clear();
  }

  enableUserAccount() {
    this.isUserActive = true;
    this.resetVariables();
    this.createForm();
  }


  enableVendorAccount() {
    this.isUserActive = false;
    this.resetVariables();
    this.createForm();
  }







  @HostListener('window:beforeunload')
  async ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }




}
