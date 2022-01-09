import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from "environments/environment";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  baseURL = environment.API_URL;

  constructor(private httpClient:HttpClient) { }

  orders(formData:any):Observable<any>{
    return this.httpClient.get<any>(this.baseURL+"/checkout/get-orders", formData);
  }

  orderDetails(formData:any):Observable<any>{
    return this.httpClient.post<any>(this.baseURL+"/checkout/get-order-detail", formData);
  }

  clearCart(formData:any):Observable<any>{
    return this.httpClient.post<any>(this.baseURL+"/cart/clear-cart", formData);
  }

  checkDeliveryStatus(formData:any):Observable<any>{
    return this.httpClient.post<any>(this.baseURL+"/checkout/get-delivery-status", formData);
  }

}
