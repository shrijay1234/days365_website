import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { LocalStorageService } from "ngx-webstorage";
import { environment } from "environments/environment";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  baseURL = environment.API_URL;


  constructor(
    private local: LocalStorageService,
    private http: HttpClient
  ) {
  }

  get2LevelCategories(id: string) {
    return this.http.get(`${this.baseURL}/category/subCategories/2level`, { params: { id: id } });
  }

  getDistinctActiveBrands() {
    return this.http.get(`${this.baseURL}/brand/distinct`);
  }

  getActiveProducts(params = {}) {
    return this.http.get(`${this.baseURL}/product/active/all`, { params: params });
  }

  getMainCategories() {
    return this.http.get(`${this.baseURL}/category/main`);
  }

  getSellerBtrands(){
    return this.http.post(`${this.baseURL}/brand/vendor/all`,{type:"seller"});
  }

  getAllProduct():Observable<any>{
    return this.http.get(`${this.baseURL}/homepageproducts/topfeaturedandotherfields`);
  }
  getAllBrand():Observable<any>{
    return this.http.get(`${this.baseURL}/brandname/getbrandname`);

  }

	getFilterProducts(params = {}){
		return this.http.get(`${this.baseURL}/filter`, { params: params });
	}
}
