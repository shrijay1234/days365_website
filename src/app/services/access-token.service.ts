import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { LocalStorageService } from "ngx-webstorage";
import { environment } from "environments/environment";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AccessTokenService {

  baseURL = environment.API_URL;

  private cachedData: Subject<any>;


  constructor(
    private local: LocalStorageService,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {
  }


  refreshData() {
    this.http.get(this.baseURL + '/token')
      .subscribe((res => {
        this.cachedData.next(res)
      }),
        (error) => { });
  }

  initializeData() {
    let accessToken = this.local.retrieve('accessToken');
    if (!this.cachedData && accessToken) {
      this.cachedData = new Subject();
      this.refreshData();
    }
  }



}
