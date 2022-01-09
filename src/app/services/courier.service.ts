import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from "environments/environment";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourierService {

  baseURL = environment.API_URL;

  constructor(private httpClient:HttpClient) { }

  pincodeCheck(params:any):Observable<any>{
    return this.httpClient.post<any>(this.baseURL+"/checkout/check-delivery-point", params);
  }

  trackService(params:any):Observable<any>{
    return this.httpClient.post<any>(this.baseURL+"/checkout/track-courier", params);
  }

}
