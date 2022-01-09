import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { LocalStorageService } from "ngx-webstorage";
import { environment } from "environments/environment";


@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  baseURL = environment.API_URL;


  constructor(
    private local: LocalStorageService,
    private http: HttpClient
  ) { }


  /**
   * Register User OR Vendor.
   */

  userSignup(signupData) {
    return this.http.post(this.baseURL + "/signup/user/presignup", signupData);
  }


  /**
   * Verify User OR Vendor during registration, mobile verification.
   */

  verifyUser(otpData) {
    return this.http.post(this.baseURL + "/signup/user", otpData);
  }


  /**
   * Resend otp during registration, for mobile verification.
   */

  resendOTP(presignupId) {
    return this.http.post(this.baseURL + "/signup/user/resendOtp", presignupId);
  }


  /**
   * Upgrade to vendor
   */

  upgradeToVendor(account) {
    return this.http.put(this.baseURL + "/signup/user/upgrade", account);
  }
}
