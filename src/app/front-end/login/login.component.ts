import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { LoginService } from 'app/services/login.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Location } from '@angular/common';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  preLoginForm: FormGroup;
  loginForm: FormGroup;

  spinner = false;
  submitted1 = false;
  submitted2 = false;
  errorMessage = "";
  isExists = false;
  field;
  isUserActive = true;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private local: LocalStorageService,
    private loginService: LoginService,
    private location: Location
  ) {
    if (this.local.retrieve('accessToken')) {
      this.router.navigateByUrl('/');
    }
  }

  ngOnInit(): void {
    this.createPreLoginForm();
  }


  createPreLoginForm() {
    this.preLoginForm = new FormGroup({
      'username': new FormControl('', Validators.required)
    });
  }


  createLoginForm() {
    this.loginForm = new FormGroup({
      'password': new FormControl('', [Validators.required])
    });
  }



  verifyUsername() {
    this.submitted1 = true;
    this.errorMessage = "";
    if (this.preLoginForm.invalid) {
      this.toastr.warning("Please provide email and mobile number");
      return;
    }
    this.spinner = true;
    this.submitted1 = false;
    this.loginService.preLogin(this.preLoginForm.get('username').value)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((payload) => {
        this.spinner = false;
        var response = JSON.parse(JSON.stringify(payload));
        // console.log("response", response);
        if (!response.error) {
          this.field = response.data;
          this.isExists = true;
          this.createLoginForm();
        }
        else {
          this.errorMessage = response.message;
        }
      }, (error) => {
        this.toastr.error(error.status + " : " + error.statusText);
        this.spinner = false;
      });
  }


  userLogin() {
    this.submitted2 = true;
    this.errorMessage = "";
    if (this.loginForm.invalid) {
      this.toastr.warning("Please provide password");
      return;
    }
    let userLoginData = {
      type: this.field.type,
      value: this.field.value,
      password: this.loginForm.get('password').value
    }
    this.spinner = true;
    this.submitted2 = false;
    this.loginService.userLogin(userLoginData)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((payload) => {
        this.spinner = false;
        var response = JSON.parse(JSON.stringify(payload));
        // console.log("response", response);
        if (!response.error) {
          let user = response.data;
          this.loginService.setLocalStorage(user);
          this.toastr.success(response.message);
          this.location.back();
        }
        else {
          this.errorMessage = response.message;
        }
      }, (error) => {
        this.toastr.error(error.status + " : " + error.statusText);
        this.spinner = false;
      });
  }


  get f1() {
    return this.preLoginForm.controls;
  }


  get f2() {
    return this.loginForm.controls;
  }


  // resetVariables() {
  //   this.spinner = false;
  //   this.submitted1 = false;
  //   this.submitted2 = false;
  //   this.errorMessage = "";
  //   this.isExists = false;
  //   this.field = null;
  // }

  enableUserAccount() {
    this.isUserActive = true;
    // this.resetVariables();
    //this.createPreLoginForm();
  }


  enableVendorAccount() {
    this.isUserActive = false;
    // this.resetVariables();
    // this.createPreLoginForm();
  }


  @HostListener('window:beforeunload')
  async ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }



}
