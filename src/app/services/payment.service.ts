import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from "environments/environment";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  baseURL = environment.API_URL;

  constructor(private httpClient:HttpClient) { }

  makePayment(formData:any):Observable<any>{
    return this.httpClient.post<any>(this.baseURL+"/checkout/checkout-payment", formData);
  }

}
