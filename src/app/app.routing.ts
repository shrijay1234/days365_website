import { AddProductNotOnDays365Component } from './seller-account/add-product-not-on-days365/add-product-not-on-days365.component';
import { SelectCateogryFormComponent } from './seller-account/select-cateogry-form/select-cateogry-form.component';
import { Routes } from '@angular/router';
import { AdminfullComponent } from './layout-seller/adminfull/adminfull.component'
import { HomeComponent } from './front-end/home/home.component';
import { ProductComponent } from './front-end/product/product.component';
import { ProductDetailComponent } from './front-end/product-detail/product-detail.component';
import { LoginComponent } from './front-end/login/login.component';
import { SignUpComponent } from './front-end/sign-up/sign-up.component';
import { CategoryComponent } from './front-end/category/category.component';
import { WishListComponent } from './front-end/wish-list/wish-list.component';
import { MyCartComponent } from './front-end/my-cart/my-cart.component';
import { ShippingDetailsComponent } from './front-end/shipping-details/shipping-details.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { ContactComponent } from './front-end/contact/contact.component';
import {OrderFailedComponent} from 'app/front-end/order-failed/order-failed.component';

import { Home13Component } from './front-end/home13/home13.component';
import { UpgradeVendorComponent } from './front-end/upgrade-vendor/upgrade-vendor.component';
import { ForgotPasswordComponent } from './front-end/forgot-password/forgot-password.component';

import { SellerStartComponent } from './seller-start/seller-start.component';
import { OrderDetailComponent } from './front-end/order-detail/order-detail.component';
import { MyOrderComponent } from './front-end/my-order/my-order.component';
import { OrderConformationComponent } from './front-end/order-conformation/order-conformation.component';
import { CompletePendingProductsComponent } from './seller-account/complete-pending-products/complete-pending-products.component';

import { SellerHomeComponent } from './seller-account/seller-home/seller-home.component';
import { AddProductComponent } from './seller-account/add-product/add-product.component';
import { ProductDaysComponent } from './seller-account/product-days/product-days.component';
import { AddNewBrandComponent } from './seller-account/add-new-brand/add-new-brand.component';
import { PromoCodeDetailsComponent } from './seller-account/promo-code-details/promo-code-details.component';
import { ListingProductListingComponent } from './seller-account/listing-product-listing/listing-product-listing.component';
import { ViewProdoctVariantsComponent } from './seller-account/view-prodoct-variants/view-prodoct-variants.component';
import { BestsellerComponent } from './front-end/bestseller/bestseller.component';
import { CheckoutComponent } from './front-end/checkout/checkout.component';
import { AboutUsComponent } from './front-end/about-us/about-us.component';
import { ListedBrandsComponent } from './seller-account/listed-brands/listed-brands.component';




export const AppRoutes: Routes = [


  {
    path: '',
    component: HomeComponent,
  }
  ,
  
  {
    path: 'start-seller',
    component: SellerStartComponent,
  },
  {path:'order-failed', component: OrderFailedComponent}
  ,
  {
    path:'order-confirmation',
    component: OrderConformationComponent
  },
  {
path:'my-profile',
component:MyProfileComponent
  },
  { path: 'login', component: LoginComponent },
  { path: 'product-detail', component: ProductDetailComponent },
  { path: 'product', component: ProductComponent },
  { path: 'shipping', component: ShippingDetailsComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'order-detail', component: OrderDetailComponent},
  { path: 'wish-list', component: WishListComponent },
  { path: 'my-cart', component: MyCartComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'productDetails', component: Home13Component },
  { path: 'my-order', component: MyOrderComponent},
  { path: 'upgrade', component: UpgradeVendorComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path:'add-product-not-on-days365', component:AddProductNotOnDays365Component},
  { path: 'select-category-form', component: SelectCateogryFormComponent },
  { path: 'seller-home', component: SellerHomeComponent },
  {path: 'complete-pending-products', component:CompletePendingProductsComponent},
  {path: 'addProductVariants', component:AddProductComponent},
  {path: 'viewProductsForAddVariants', component:ProductDaysComponent},
  {path: 'view-prodoct-variants', component:ViewProdoctVariantsComponent},
  {path: 'brand', component:AddNewBrandComponent},
  {path: 'promoCodeList', component:PromoCodeDetailsComponent},
  {path: 'listing-product-listing', component:ListingProductListingComponent},
{path: 'bestseller', component:BestsellerComponent},
{path:'contact', component:ContactComponent},
{path: 'ccavResponseHandler', component:CheckoutComponent},
{path: 'about-us', component:AboutUsComponent},
{
path:'listed-brand', component:ListedBrandsComponent
},
  {
    path: '',
    component: AdminfullComponent,
    children: [
      {
        path: 'admin',
        redirectTo: 'admin',
        pathMatch: 'full'
      },


      {
        path: '',
        loadChildren:
          () => import('./seller-component/material.module').then(m => m.AdminComponentsModule)
      },

      {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
      }


    ]
  },

  {
    path: '**',
    component: HomeComponent,
  }


];
