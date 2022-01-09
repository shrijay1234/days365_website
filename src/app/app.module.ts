
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxWebstorageModule } from "ngx-webstorage";
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';
// import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from './demo-material-module';
import { InterceptorService } from "./services/interceptor.service";
import { SharedModule } from './shared/shared.module';
import { SignaturePadModule } from 'angular2-signaturepad';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon'; 
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatRadioModule} from '@angular/material/radio';
import {MatNativeDateModule} from '@angular/material';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatBadgeModule} from '@angular/material/badge';

import { NgxSliderModule } from '@angular-slider/ngx-slider';

// import { MatMomentDateModule } from "@angular/material-moment-adapter";


import { SpinnerComponent } from './shared/spinner.component';
import { AdminComponent } from './admin/admin.component';
import { AdminheaderComponent } from './layout-seller/adminfull/adminheader/adminheader.component';
import { AdminFooterComponent } from './layout-seller/adminfull/admin-footer/admin-footer.component';
import { AdminfullComponent } from './layout-seller/adminfull/adminfull.component';
import { AdminSidebarComponent } from './layout-seller/adminfull/admin-sidebar/admin-sidebar.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './front-end/home/home.component';
import { FrontHeaderComponent } from './front-end/front-header/front-header.component';
import { FrontFooterComponent } from './front-end/front-footer/front-footer.component';
import { ProductComponent } from './front-end/product/product.component';
import { ProductDetailComponent } from './front-end/product-detail/product-detail.component';
import { LoginComponent } from './front-end/login/login.component';
import { SignUpComponent } from './front-end/sign-up/sign-up.component';
import { CategoryComponent } from './front-end/category/category.component';

import { WishListComponent } from './front-end/wish-list/wish-list.component';
import {MyCartComponent} from './front-end/my-cart/my-cart.component';
import { ShippingDetailsComponent } from './front-end/shipping-details/shipping-details.component';

import { Home13Component } from './front-end/home13/home13.component';
import { UpgradeVendorComponent } from './front-end/upgrade-vendor/upgrade-vendor.component';
import { SellerStartComponent } from './seller-start/seller-start.component';
import { ForgotPasswordComponent } from './front-end/forgot-password/forgot-password.component';
import { OrderDetailComponent } from './front-end/order-detail/order-detail.component';
import { MyOrderComponent } from './front-end/my-order/my-order.component';
import { OrderConformationComponent } from './front-end/order-conformation/order-conformation.component';
import { SellerHomeComponent } from './seller-account/seller-home/seller-home.component';
import { NavigationComponent } from './seller-account/navigation/navigation.component';
import { AddProductNotOnDays365Component } from './seller-account/add-product-not-on-days365/add-product-not-on-days365.component';
import { AddNewBrandComponent } from './seller-account/add-new-brand/add-new-brand.component';
import { SellerFooterComponent } from './seller-account/seller-footer/seller-footer.component';
import { SellerHeaderComponent } from './seller-account/seller-header/seller-header.component';
import { SelectCateogryFormComponent } from './seller-account/select-cateogry-form/select-cateogry-form.component';
import { CompletePendingProductsComponent } from './seller-account/complete-pending-products/complete-pending-products.component';
import { AddProductComponent } from './seller-account/add-product/add-product.component';
import { ProductDaysComponent } from './seller-account/product-days/product-days.component';
import { PromoCodeDetailsComponent } from './seller-account/promo-code-details/promo-code-details.component';


import { ListingProductListingComponent } from './seller-account/listing-product-listing/listing-product-listing.component';
import { ViewProdoctVariantsComponent } from './seller-account/view-prodoct-variants/view-prodoct-variants.component';
import { BestsellerComponent } from './front-end/bestseller/bestseller.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { CheckoutComponent } from './front-end/checkout/checkout.component';
import { OrderFailedComponent } from './front-end/order-failed/order-failed.component';

import { ContactComponent } from './front-end/contact/contact.component';
import { AboutUsComponent } from './front-end/about-us/about-us.component';
import { ListedBrandsComponent } from './seller-account/listed-brands/listed-brands.component';
import {CarouselModule}  from 'ngx-bootstrap/carousel';
import { OwlModule } from 'ngx-owl-carousel';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    AdminComponent,
    AdminheaderComponent,
    AdminFooterComponent,
    AdminfullComponent,
    AdminSidebarComponent,
    HomeComponent,
    FrontHeaderComponent,
    FrontFooterComponent,
    ProductComponent,
    ProductDetailComponent,
    LoginComponent,
    SignUpComponent,
    CategoryComponent,
  
    WishListComponent,
    MyCartComponent,
    ShippingDetailsComponent,
    
    Home13Component,
    UpgradeVendorComponent,
    SellerStartComponent,
    ForgotPasswordComponent,
    
    OrderDetailComponent,
    
    MyOrderComponent,
    
    OrderConformationComponent,
    
    SellerHomeComponent,
    
    NavigationComponent,
    
    AddProductNotOnDays365Component,
    
    
    
    AddNewBrandComponent,
    
    SellerFooterComponent,
    
    SellerHeaderComponent,
    
    SelectCateogryFormComponent,
    
    CompletePendingProductsComponent,
    
    AddProductComponent,
    
    ProductDaysComponent,
    
    PromoCodeDetailsComponent,
    ListingProductListingComponent,
    
    ViewProdoctVariantsComponent,
    
    BestsellerComponent,
    
    MyProfileComponent,
    
    CheckoutComponent,
    
    OrderFailedComponent,
    
    
    ContactComponent,
    
    
    AboutUsComponent,
    
    
    ListedBrandsComponent,
    
    
   
    
    
  
    
    
 
  
  ],
  imports: [
    BrowserModule,
    NgxWebstorageModule.forRoot(),
    BrowserAnimationsModule,
    CarouselModule,
    DemoMaterialModule,
    FormsModule,
    FlexLayoutModule,
    HttpClientModule,
    // CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot(AppRoutes),
    SignaturePadModule,
    MatStepperModule,
    MatIconModule,
    MatButtonModule,
    NgxPaginationModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatBadgeModule,
    NgxSliderModule,
    MatRadioModule,
    MatNativeDateModule,
    OwlModule,
    MatPaginatorModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, multi: true, useClass: InterceptorService}
  ],

  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
