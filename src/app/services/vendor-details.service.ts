import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { LocalStorageService } from "ngx-webstorage";
import { environment } from "environments/environment";
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class VendorDetailsService {

  baseURL = environment.API_URL;


  constructor(
    private local: LocalStorageService,
    private http: HttpClient
  ) { }


  /**
   * Get vendor Details.
   */

  getVendorDetails() {
    return this.http.get(this.baseURL + "/vendorDetails");
  }


  /**
   *  Company name available or not.
   */

  isCompanyNameAvailable(company) {
    return this.http.get(this.baseURL + "/vendorDetails/companyName/status", { params: company });
  }


  /**
   *  Create vendor details record.
   */

  createVendorRecord(company) {
    return this.http.post(this.baseURL + "/vendorDetails", company);
  }


  /**
   *  Shop name available or not.
   */

  isStoreNameAvailable(store) {
    return this.http.get(this.baseURL + "/vendorDetails/storeName/status", { params: store });
  }


  /**
   *  Update Store name
   */

  updateStoreName(store) {
    return this.http.put(this.baseURL + "/vendorDetails/storeName", store);
  }



  /**
   *  Update company address
   */

  updateCompanyAddress(companyAddress) {
    return this.http.put(this.baseURL + "/vendorDetails/companyAddress", companyAddress);
  }


  /**
   *  Update Seller Details
   */

  updateSellerDetails(sellerData) {
    return this.http.put(this.baseURL + "/vendorDetails/sellerInfo", sellerData);
  }


  /**
   *  Update Tax details
   */

  updateTaxDetails(taxData) {
    return this.http.put(this.baseURL + "/vendorDetails/taxDetails", taxData);
  }


  /**
   *  Update Shipping Fee
   */

  updateShippingFee(shippingFee) {
    return this.http.put(this.baseURL + "/vendorDetails/shippingFee", shippingFee);
  }


  /**
   * Update Bank Details
   */

  updateBankDetails(bankData) {
    return this.http.put(this.baseURL + "/vendorDetails/bankDetails", bankData);
  }

  /**
   * Update Product Category
   */

   updateProductCategory(categoryData:any) {
    return this.http.put(this.baseURL + "/vendorDetails/addProductCategory", categoryData);
  }

  /**
   *  Update Product Tax Code
   */

  updateProductTaxCode(productTaxCode) {
    return this.http.put(this.baseURL + "/vendorDetails/productTaxCode", productTaxCode);
  }


  /**
   * Update Signature
   */

  updateSignature(sginatureData) {
    // Add this header to allow browser to append content-type header automatically in order to avoid boundary not found error at the server.
    let headers = { 'Multi-Part-Request': 'dummy-header' };
    return this.http.put(this.baseURL + "/vendorDetails/signature", sginatureData, { headers: headers });
  }


  /** 
   *  update GST exempted status
   */

  updateGstExemptedStatus(status) {
    return this.http.put(this.baseURL + "/vendorDetails/taxDetails/gstExempted", status);
  }


  /**
   *  Get country states
   */

  getStates(country) {
    return this.http.get(this.baseURL + "/country", { params: country });
  }


  /**
   *  Get Signature presigned URL
   */

  getSignatureURL() {
    return this.http.get(this.baseURL + "/vendorDetails/signature");
  }


  /**
   *  Upload vendor private files
   */

  uploadVendorPrivateFile(fileData) {
    let headers = { 'Multi-Part-Request': 'dummy-header' };
    return this.http.put(this.baseURL + "/vendorDetails/sellerFile", fileData, { headers: headers });
  }


  /**
   * Get vendor private file presigned URL
   */

  getVendorPrivateFileURL(params) {
    return this.http.get(this.baseURL + "/vendorDetails/sellerFile", { params: params });
  }


  /**
   * Get product tax codes
   */

  getProductTaxCodes() {
    let params = {
      utilityName: "Product Tax Codes"
    }
    return this.http.get(this.baseURL + "/utility", { params: params });
  }

  getMainCategory(params = {}):Observable<any>{
    return this.http.get<any>(this.baseURL+"/category/main",{ params: params });
  }


  requestAdminApproval() {
    return this.http.put(this.baseURL + "/vendorDetails/request/approveAccount",{});
  }

}

