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
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  forgotPasswordForm: FormGroup;
  otpForm: FormGroup;
  passwordForm: FormGroup;

  spinner = false;
  submitted = false;
  errorMessage = "";
  otpId = "";
  pass = false;

  step: number;

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
    this.step = 1;
  }


  ngOnInit(): void {
    this.createforgetPasswordForm();
  }

  createforgetPasswordForm() {
    this.forgotPasswordForm = new FormGroup({
      'username': new FormControl('', Validators.required)
    });
  }

  createOtpForm() {
    this.otpForm = new FormGroup({
      'otp': new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{6}$/)])
    });
  }

  createPasswordForm() {
    this.passwordForm = new FormGroup({
      'password': new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]),
      'confirmPassword': new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(50)])
    });
  }


  sendOTP() {
    this.submitted = true;
    this.errorMessage = "";
    if (this.forgotPasswordForm.invalid) {
      this.toastr.warning("Please enter a valid username");
      return;
    }
    this.spinner = true;
    this.submitted = false;
    this.loginService.sendOTP(this.forgotPasswordForm.getRawValue())
      .pipe(takeUntil(this.destroyed$))
      .subscribe((payload) => {
        this.spinner = false;
        var response = JSON.parse(JSON.stringify(payload));
        console.log("otp", response.data.otp);
        if (!response.error) {
          this.step = 2;
          this.otpId = response.data.id;
          this.createOtpForm();
        }
        else {
          this.errorMessage = response.message;
        }
      }, (error) => {
        console.log(error);
        this.toastr.error(error.status + " : " + error.statusText);
        this.spinner = false;
      });
  }


  verifyOTP() {
    this.submitted = true;
    this.errorMessage = "";
    if (this.otpForm.invalid) {
      this.toastr.warning("Please enter a valid Otp");
      return;
    }
    if (this.otpId == "") {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/forgot-password']);
      });
    }
    this.spinner = true;
    this.submitted = false;
    let otpData = {
      id: this.otpId,
      otp: this.otpForm.get('otp').value
    }
    this.loginService.verifyOTP(otpData)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((payload) => {
        this.spinner = false;
        var response = JSON.parse(JSON.stringify(payload));
        // console.log("response2", response);
        if (!response.error) {
          this.step = 3;
          this.otpId = response.data.id;
          this.createPasswordForm();
        }
        else {
          this.errorMessage = response.message;
        }
      }, (error) => {
        this.toastr.error(error.status + " : " + error.statusText);
        this.spinner = false;
      });
  }


  resetPassword() {
    this.submitted = true;
    this.errorMessage = "";
    if (this.passwordForm.invalid) {
      this.toastr.warning("Please enter a valid password");
      return;
    }
    this.comparePasswords();
    if (!this.pass) {
      return;
    }
    if (this.otpId == "") {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/forgot-password']);
      });
    }
    this.spinner = true;
    this.submitted = false;
    let passwordData = {
      id: this.otpId,
      password: this.passwordForm.get('password').value
    }
    this.loginService.resetPassword(passwordData)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((payload) => {
        this.spinner = false;
        var response = JSON.parse(JSON.stringify(payload));
        // console.log("response3", response);
        if (!response.error) {
          this.toastr.success(response.message);
          this.router.navigateByUrl('/login');
        }
        else {
          this.errorMessage = response.message;
        }
      }, (error) => {
        this.toastr.error(error.status + " : " + error.statusText);
        this.spinner = false;
      });
  }




  comparePasswords() {
    this.pass = this.passwordForm.get('password').value === this.passwordForm.get('confirmPassword').value;
  }

  get f1() {
    return this.forgotPasswordForm.controls;
  }

  get f2() {
    return this.otpForm.controls;
  }

  get f3() {
    return this.passwordForm.controls;
  }


  @HostListener('window:beforeunload')
  async ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
