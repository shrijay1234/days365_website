import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { RegistrationService } from 'app/services/registration.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-upgrade-vendor',
  templateUrl: './upgrade-vendor.component.html',
  styleUrls: ['./upgrade-vendor.component.css']
})
export class UpgradeVendorComponent implements OnInit, OnDestroy {

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  upgradeForm: FormGroup;
  spinner = false;
  submitted = false;
  errorMessage = "";


  constructor(
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private local: LocalStorageService,
    private registrationService: RegistrationService
  ) {
    if (this.local.retrieve('accessToken')) {
      this.router.navigateByUrl('/');
    }
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.upgradeForm = this.formBuilder.group({
      'username': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]),
    });
  }



  get f() {
    return this.upgradeForm.controls;
  }


  onSubmit() {
    this.submitted = true;
    this.errorMessage = "";
    if (this.upgradeForm.invalid) {
      this.toastr.warning("Please fill all the required fileds");
      // console.log("form", this.registerForm.value);
      return;
    }
    this.spinner = true;
    this.submitted = false;
    this.registrationService.upgradeToVendor(this.upgradeForm.getRawValue())
      .pipe(takeUntil(this.destroyed$))
      .subscribe((payload) => {
        this.spinner = false;
        var response = JSON.parse(JSON.stringify(payload));
        if (!response.error) {
          this.toastr.success(response.message);
          this.router.navigateByUrl('/');
        }
        else {
          this.errorMessage = response.message;
        }
      }, (error) => {
        this.toastr.error(error.status + " : " + error.statusText);
        this.spinner = false;
      });
  }





  @HostListener('window:beforeunload')
  async ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
