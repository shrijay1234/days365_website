import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "environments/environment";



@Injectable({
  providedIn: 'root'
})
export class SellerAccountService {

  baseURL = environment.API_URL;

  constructor(private httpClient:HttpClient) { }

  getCategories():Observable<any[]>{
    return this.httpClient.get<any[]>(this.baseURL+"/category/main");
  }

  Register(formData:any):Observable<any>{
    let headers = { 'Multi-Part-Request': 'dummy-header' };
    return this.httpClient.post<any>(this.baseURL+"/brand/register", formData,{ headers: headers });
  }

  searchForCategory(selectCategoryForm:any):Observable<any>{
    return this.httpClient.post<any>(this.baseURL+"/category/getCategoriesByName",selectCategoryForm);
  }
 
  getBrowseCategory(params = {}):Observable<any>{
    return this.httpClient.get<any>(this.baseURL+"/category/getCategoriesBrowse",{ params: params });
  }

  getCountryName():Observable<any>{
    return this.httpClient.get<any>(this.baseURL+"/country/getCountryList");
  }

  registerProductNotOnDays365(selectCategoryFormView:any):Observable<any>{
    return this.httpClient.post<any>(this.baseURL+"/product/addNewProduct", selectCategoryFormView);
  }

  getProductTaxCodes() {
    let params = {
      utilityName: "Product Tax Codes"
    }
    return this.httpClient.get(this.baseURL + "/utility", { params: params });
  }
  searchAProduct(selectProductForm:any):Observable<any>{
    return this.httpClient.post<any>(this.baseURL+"/product/searchProduct",selectProductForm);
  }
  
  getAllProductList(params = {}) {
    return this.httpClient.post(this.baseURL +'/product/getAllProductOnSeller',params);
  }

  addProductVariant(data:any):Observable<any> {
    //let headers = { 'Multi-Part-Request': 'dummy-header' };
    return this.httpClient.put(this.baseURL +'/product/addProductVarient',data);
  }

  uploadFile(formData: FormData) {
    // Add this header to allow browser to append content-type header automatically in order to avoid boundary not found error at the server.
    let headers = { 'Multi-Part-Request': 'dummy-header' };
    return this.httpClient.post(this.baseURL + '/upload/upload', formData, { headers: headers });
  }
  getBrands(params = {}) {
    return this.httpClient.post(this.baseURL +'/brand/getBrands',params);
  }
  
  getProductVariant(params = {}) {
    return this.httpClient.get(this.baseURL +'/product/getProductVariantOnSeller/',{ params: params });
  }
  
  getPromoCodeList(params = {}) {
    return this.httpClient.get(this.baseURL +'/promoter/getPromoCodeListOnVendor?type=seller',params);
  }
  
}
