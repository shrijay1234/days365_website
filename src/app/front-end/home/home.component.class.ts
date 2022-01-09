import { strategy } from "@angular-devkit/core/src/experimental/jobs"

export class Categories{
    category_name:string
image_URL: string
is_leaf: boolean
is_restricted: boolean
}

export class Product{
    
Ingredients: string
brandName: string
bulletPoint: number
categoryName: string
category_id: string
category_path: string
condition: string
conditionNote: string
countryOfOrigin: string
createdAt: Date
handlingPeriod: 2
howToUse:string
isProductExpirable:string
keyFeatures: string
legalClaimer: string
manuFacturer: string
minRecommendedAge: number
percentageOnBrand: number
productDescription:string
productTaxCode: string
productVariant: string
shippingCharges:string
shippingChargesAmt: number
status: string
targetAudience: string
taxCodePercentage: string
title: string
}
export class ProductSimmilar{
    brandName: string
bulletPoint: string
categoryName: string
category_id: string
category_path: string
condition:string
conditionNote: string
countryOfOrigin:string
createdAt:string
handlingPeriod:string
isProductExpirable: string
keyFeatures:string
legalClaimer: string
manuFacturer: string
minRecommendedAge: string
percentageOnBrand: string
productDescription: string
productVariant: any;
yourPrice:string;
searchTermsArr: string
shippingCharges: string
shippingChargesAmt: string
status: string
targetAudience: string
title: string
updatedAt: string
venderName:string
}