import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { LocalStorageService } from "ngx-webstorage";
import { environment } from "environments/environment";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  baseURL = environment.API_URL;

  constructor(
    private local: LocalStorageService,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) { }


  /**
   * Pre Login User.
   */

  preLogin(preLoginData) {
    return this.http.get(this.baseURL + "/signin/user/" + preLoginData);
  }


  /**
   * Login User.
   */

  userLogin(loginData) {
    return this.http.post(this.baseURL + "/signin/user", loginData);
  }


  /**
   * Store Tokens
   */

  setLocalStorage(user) {
    this.local.clear();
    this.local.store('accessToken', user.accessToken);
    this.local.store('refreshToken', user.refreshToken);
    this.local.store('fullname', user.fullname);
    this.local.store('type', user.type);
  }


  /**
   * Logout User on token expires.
   */

  logout() {
    this.local.clear();
    this.toastr.success("you were signed out from the device");
    this.router.navigateByUrl('/');
  }


  /**
   * logout User
   */

  logoutUser() {
    const refreshToken = this.local.retrieve('refreshToken');
    // let type = this.local.retrieve('type').toLowerCase();
    return this.http.post(`${this.baseURL}/signout/user`, { refreshToken: refreshToken });
  }


  /**
   * Refresh expired Access token.
   */

  refreshAccessToken() {
    const refreshToken = this.local.retrieve('refreshToken');
    return this.http.post(this.baseURL + "/token/refresh", { refreshToken: refreshToken });
  }


  /**
   * Send OTP to MOBILE OR EMAIL : reset password
   */

  sendOTP(accountData) {
    return this.http.post(this.baseURL + '/resetPassword/user/sendOTP', accountData);
  }


  /**
   * Verify OTP : reset password
   */

  verifyOTP(otpData) {
    return this.http.post(this.baseURL + '/resetPassword/user/verifyOTP', otpData);
  }


  /**
   * Reset Password
   */

  resetPassword(passwordData) {
    return this.http.post(this.baseURL + '/resetPassword/user', passwordData);
  }


getUserDetails():Observable<any>{
  return this.http.get(this.baseURL +'/user/userdetails')
}
updateUserProfile(userDetail):Observable<any>{
return this.http.post(this.baseURL + '/user/userupdate', userDetail);
}
}


