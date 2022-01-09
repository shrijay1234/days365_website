import {
	Component,
	OnInit,
	ViewChild,
	OnDestroy,
	HostListener,
	Input,
  } from "@angular/core";
  import {
	FormGroup,
	FormArray,
	ValidatorFn,
	FormControl,
	Validators,
	FormBuilder,
	Form,
	NgForm,
  } from "@angular/forms";
  import { LocalStorageService } from "ngx-webstorage";
  import { VendorDetailsService } from "app/services/vendor-details.service";
  import { Router } from "@angular/router";
  import { ToastrService } from "ngx-toastr";
  import { ReplaySubject } from "rxjs";
  import { takeUntil } from "rxjs/operators";
  import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
  import { MatStepper } from "@angular/material";
  import { SignaturePad } from "angular2-signaturepad";
  import { SellerAccountService } from "./../services/seller-account.service";
  import { JsonObject } from "@angular-devkit/core";
  
  @Component({
	selector: "app-seller-start",
	templateUrl: "./seller-start.component.html",
	styleUrls: ["./seller-start.component.css"],
	providers: [
	  {
		provide: STEPPER_GLOBAL_OPTIONS,
		useValue: { displayDefaultIndicatorType: false },
	  },
	],
  })
  export class SellerStartComponent implements OnInit, OnDestroy {
	private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
	signaturePadOptions: Object = {
	  minWidth: 5,
	  canvasWidth: 750,
	  canvasHeight: 300,
	};
  
	companyNameForm!: FormGroup;
	registerSellerForm!: FormGroup;
	taxDetailsForm!: FormGroup;
	taxDetailsForm2!: FormGroup;
	shippingFeeForm!: FormGroup;
	bankAccountForm!: FormGroup;
	productTaxCodeForm!: FormGroup;
	productCategoryForm!: FormGroup;
  
	file: File;
	foodLicense: File;
	gstLicense: File;
	shopLicense: File;
	blankCheque: File;
	sizeExceed = ["", "", "", "", ""];
  
	@ViewChild("stepper")
	stepper: MatStepper;
  
	@ViewChild("sellerStepper")
	sellerStepper: MatStepper;
  
	@ViewChild("taxForm1") taxForm1;
	@ViewChild("taxForm2") taxForm2;
  
	@ViewChild(SignaturePad) signaturePad: SignaturePad;
  
	sellerName: string;
  
	isLinear = true;
	selectedRadio = "0";
	taxOptions = ["0", "1", "2"];
	isChecked = [false, false];
	isNameAvailable = 0;
	bankAccountTypes = ["Savings Account", "Current Account"];
	productTaxCodes: [] = [];
	taxOption: boolean;
	selectedImageUploadOption = 0;
	mySignature = "";
	myFoodLicense = "";
	myGstLicense = "";
	myShopLicense = "";
	myBlankCheque = "";
	BrowseCategory = [];
	multi: boolean = false;
	orders: any[] = [];
	categoryArr;
  
	updateFlags = [true, true, true, true, true, true, true, true, true];
  
	submitted = [false, false, false, false, false];
	spinner = [
	  false,
	  false,
	  true,
	  true,
	  false,
	  false,
	  false,
	  false,
	  false,
	  false,
	  false,
	  false,
	  false,
	  false,
	];
	errorMessage = ["", "", "", "", "", "", "", "", "", "", "", "", ""];
  
	statusList = {
	  is_mobile_verified: true,
	  is_seller_info_collected: false,
	  is_tax_details_collected: false,
	};
	vendorData;
	stateList: [] = [];
	//source =[];
  
	set value(value: boolean[]) {}
	get value(): boolean[] {
	  return this.productCategoryForm.value.orders
		.map((v, i) => (v ? this.orders[i]._id : null))
		.filter((v) => v !== null);
	}
  
	constructor(
	  private formBuilder: FormBuilder,
	  private router: Router,
	  private toastr: ToastrService,
	  private local: LocalStorageService,
	  private vendorDetailsService: VendorDetailsService,
	  private sellerAccountService: SellerAccountService
	) {
	  let accessToken = this.local.retrieve("accessToken");
	  let type = this.local.retrieve("type");
	  this.sellerName = this.local.retrieve("fullname");
	  if (!accessToken || type !== "vendor") {
		this.router.navigateByUrl("/");
	  }
	  this.getStates();
	  this.getProductTaxCodes();
	  this.getCategories();
  
	  this.productCategoryForm = this.formBuilder.group({
		orders: new FormArray([], this.minSelectedCheckboxes(0)),
	  });
  
	  setTimeout(() => {
		const bak = JSON.parse(JSON.stringify(this.BrowseCategory));
		const controls = bak.map((c) => new FormControl(false));
		this.productCategoryForm = this.formBuilder.group({
		  orders: new FormArray(controls, this.minSelectedCheckboxes(0)),
		});
  
		!this.multi &&
		  this.productCategoryForm.controls.orders.setValidators([
			this.minSelectedCheckboxes(0),
			//this.maxSelectedCheckboxes(3)
		  ]);
  
		this.orders = this.BrowseCategory;
		this.patchValue();
	  }, 2000);
	}
  
	ngOnInit(): void {
	  this.getVendorDetails();
	}
  
	patchValue() {
	  this.BrowseCategory.map((perm, i) => {
		if (this.categoryArr) {
		  if (this.categoryArr.indexOf(perm._id) !== -1) {
			let x = <FormArray>this.productCategoryForm.controls["orders"];
			x.at(i).patchValue(true);
		  }
		}
	  });
	}
  
	createForms() {
	  this.companyNameForm = new FormGroup({
		companyName: new FormControl("", [Validators.required]),
	  });
  
	  this.registerSellerForm = new FormGroup({
		storeName: new FormControl("", [Validators.required]),
		country: new FormControl({ value: "India", disabled: true }, [
		  Validators.required,
		]),
		state: new FormControl("Andhra Pradesh", [Validators.required]),
		city: new FormControl("", [Validators.required]),
		pincode: new FormControl("", [
		  Validators.required,
		  Validators.pattern(/^[1-9][0-9]{5}$/),
		]),
		addressLine1: new FormControl(""),
		addressLine2: new FormControl(""),
		shippingMethod: new FormControl("Fulfillment by Days365", [
		  Validators.required,
		]),
	  });
  
	  let shippingFee: number = this.vendorData
		? this.vendorData.shipping_fee
		: 0;
	  let bankAccountDetails =
		this.vendorData && this.vendorData.bank_account_details
		  ? this.vendorData.bank_account_details
		  : null;
	  let taxDetails =
		this.vendorData && this.vendorData.tax_details
		  ? this.vendorData.tax_details
		  : null;
	  this.taxOption = taxDetails && taxDetails.is_GST_exempted ? true : false;
  
	  this.taxDetailsForm = new FormGroup({
		state: new FormControl("Andhra Pradesh", [Validators.required]),
		sellerName: new FormControl("", [Validators.required]),
		gstNumber: new FormControl("", [
		  Validators.required,
		  Validators.pattern(
			/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
		  ),
		]),
		panNumber: new FormControl("", [
		  Validators.required,
		  Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/),
		]),
	  });
  
	  this.shippingFeeForm = new FormGroup({
		shippingFee: new FormControl(shippingFee, [
		  Validators.required,
		  Validators.min(0),
		]),
	  });
  
	  this.bankAccountForm = new FormGroup({
		accountHolderName: new FormControl(
		  bankAccountDetails ? bankAccountDetails.account_holder_name : "",
		  [Validators.required]
		),
		accountType: new FormControl(
		  bankAccountDetails
			? bankAccountDetails.account_type
			: "Savings Account",
		  [Validators.required]
		),
		accountNumber: new FormControl(
		  bankAccountDetails ? bankAccountDetails.account_number : "",
		  [Validators.required, Validators.pattern(/^[0-9]{9,18}$/)]
		),
		ifscCode: new FormControl(
		  bankAccountDetails && bankAccountDetails.IFSC_code
			? bankAccountDetails.IFSC_code
			: "",
		  [Validators.required, Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]
		),
	  });
  
	  let tState =
		!this.taxOption && taxDetails && taxDetails.state
		  ? taxDetails.state
		  : "Andhra Pradesh";
	  let tSellerName =
		!this.taxOption && taxDetails && taxDetails.seller_name
		  ? taxDetails.seller_name
		  : "";
	  let tGstNumber =
		!this.taxOption && taxDetails && taxDetails.GST_number
		  ? taxDetails.GST_number
		  : "";
	  let tPanNumber =
		!this.taxOption && taxDetails && taxDetails.PAN_number
		  ? taxDetails.PAN_number
		  : "";
	  this.taxDetailsForm2 = new FormGroup({
		state: new FormControl(tState, [Validators.required]),
		sellerName: new FormControl(tSellerName, [Validators.required]),
		gstNumber: new FormControl(tGstNumber, [
		  Validators.required,
		  Validators.pattern(
			/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
		  ),
		]),
		panNumber: new FormControl(tPanNumber, [
		  Validators.required,
		  Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/),
		]),
	  });
  
	  let TaxCode =
		this.vendorData && this.vendorData.product_tax_code
		  ? this.vendorData.product_tax_code
		  : "A_GEN_EXEMPT";
	  let TaxCodePercentage =
		this.vendorData && this.vendorData.taxCodePercentage
		  ? this.vendorData.taxCodePercentage
		  : "0";
	  let productTaxCode = `${TaxCode}@${TaxCodePercentage}`;
	  this.isChecked[1] =
		this.vendorData && this.vendorData.product_tax_code ? true : false;
	  this.productTaxCodeForm = new FormGroup({
		productTaxCode: new FormControl(productTaxCode, [Validators.required]),
	  });
  
	  if (this.vendorData) {
		if (this.vendorData.signature_file_name) {
		  this.getSignatureURL();
		}
		if (this.vendorData.food_license_file_name) {
		  this.getFoodLicenseURL();
		}
		if (this.vendorData.GST_license_file_name) {
		  this.getGSTLicenseURL();
		}
		if (this.vendorData.shop_license_file_name) {
		  this.getShopLicenseURL();
		}
		if (this.vendorData.blank_cheque_file_name) {
		  this.getBlankchequeURL();
		}
	  }
	}
  
	// seller agreement checkbox validator
  
	checkBoxChange1() {
	  if (!this.isChecked[0]) {
		this.errorMessage[0] = "Please accept seller agreement.";
	  } else {
		this.errorMessage[0] = "";
	  }
	}
  
	/**
	 * Get vendor Details.
	 */
  
	getVendorDetails() {
	  this.vendorDetailsService
		.getVendorDetails()
		.pipe(takeUntil(this.destroyed$))
		.subscribe(
		  (payload) => {
			var response = JSON.parse(JSON.stringify(payload));
			if (!response.error) {
			  this.categoryArr = response.data.ProductCategoryId;
			  this.statusList = response.data.status_list;
			  this.vendorData = response.data;
			  if (
				["Approved", "Requested"].includes(this.vendorData.account_status)
			  ) {
				for (let i in this.spinner) {
				  this.spinner[i] = true;
				}
			  }
			  if (this.statusList.is_tax_details_collected) {
				setTimeout(() => {
				  this.stepper.selectedIndex = 3;
				});
			  } else if (this.statusList.is_seller_info_collected) {
				setTimeout(() => {
				  this.stepper.selectedIndex = 2;
				});
			  } else {
				setTimeout(() => {
				  this.stepper.selectedIndex = 1;
				  setTimeout(() => {
					this.sellerStepper.selectedIndex = 1;
				  });
				});
			  }
			} else {
			  this.vendorData = null;
			  setTimeout(() => {
				this.stepper.selectedIndex = 1;
				setTimeout(() => {
				  this.sellerStepper.selectedIndex = 0;
				});
			  });
			}
			this.createForms();
		  },
		  (error) => {
			this.toastr.error(error.status + " : " + error.statusText);
		  }
		);
	}
  
	/**
	 *  Create vendor details record.
	 */
  
	createVendorRecord() {
	  this.submitted[0] = true;
	  if (this.companyNameForm.invalid) {
		// this.errorMessage[0] = "Please provide company name.";
		return;
	  }
	  if (!this.isChecked[0]) {
		this.errorMessage[0] = "Please accept seller agreement.";
		return;
	  }
	  this.errorMessage[0] = "";
	  this.submitted[0] = false;
	  this.spinner[0] = true;
	  this.vendorDetailsService
		.createVendorRecord(this.companyNameForm.getRawValue())
		.pipe(takeUntil(this.destroyed$))
		.subscribe(
		  (payload) => {
			var response = JSON.parse(JSON.stringify(payload));
			this.spinner[0] = false;
			// console.log("vendor details", response);
			if (!response.error) {
			  this.toastr.success(response.message);
			  this.ngOnInit();
			  this.router
				.navigateByUrl("/start-seller", { skipLocationChange: true })
				.then(() => {
				  this.router.navigate(["/start-seller"]);
				});
			} else {
			  this.errorMessage[0] = response.message;
			}
		  },
		  (error) => {
			this.toastr.error(error.status + " : " + error.statusText);
			this.spinner[0] = false;
		  }
		);
	}
  
	/**
	 *  Shop name available or not.
	 */
  
	isStoreNameAvailable(event) {
	  let storeName = event.target.value ? event.target.value.trim() : null;
	  if (!storeName) {
		this.isNameAvailable = 0;
		return;
	  }
	  let store = {
		storeName: storeName,
	  };
	  this.vendorDetailsService
		.isStoreNameAvailable(store)
		.pipe(takeUntil(this.destroyed$))
		.subscribe(
		  (payload) => {
			var response = JSON.parse(JSON.stringify(payload));
			if (!response.error) {
			  let name = this.registerSellerForm.get("storeName").value.trim();
			  if (name && !response.data.isAvailable) {
				this.isNameAvailable = 2;
			  } else if (name && response.data.isAvailable) {
				this.isNameAvailable = 1;
			  } else {
				this.isNameAvailable = 0;
			  }
			} else {
			  this.toastr.error(response.message);
			}
		  },
		  (error) => {
			this.toastr.error(error.status + " : " + error.statusText);
			this.spinner[0] = false;
		  }
		);
	}
  
	/**
	 *  Update Store name
	 */
  
	updateStoreName() {}
  
	/**
	 *  Update company address
	 */
  
	updateCompanyAddress() {}
  
	/**
	 *  Update Seller Details
	 */
  
	updateSellerDetails() {
	  this.errorMessage[1] = "";
	  this.submitted[1] = true;
	  if (this.registerSellerForm.invalid) {
		// this.toastr.warning('invalid form');
		return;
	  }
	  if (this.isNameAvailable !== 1) {
		return;
	  }
	  this.spinner[1] = true;
	  this.submitted[1] = false;
	  this.vendorDetailsService
		.updateSellerDetails(this.registerSellerForm.getRawValue())
		.pipe(takeUntil(this.destroyed$))
		.subscribe(
		  (payload) => {
			var response = JSON.parse(JSON.stringify(payload));
			this.spinner[1] = false;
			if (!response.error) {
			  this.toastr.success(response.message);
			  this.ngOnInit();
			  this.router
				.navigateByUrl("/start-seller", { skipLocationChange: true })
				.then(() => {
				  this.router.navigate(["/start-seller"]);
				});
			} else {
			  this.errorMessage[1] = response.message;
			}
		  },
		  (error) => {
			this.toastr.error(error.status + " : " + error.statusText);
			this.spinner[1] = false;
		  }
		);
	}
  
	// route tax update
  
	routeTaxUpdate() {
	  let code = this.selectedRadio;
	  switch (code) {
		case "0":
		  this.updateTaxDetails();
		  break;
		case "1":
		  this.updateGstExemptedStatus({ isGstExempted: true });
		  break;
		case "2":
		  this.updateGstExemptedStatus({ isGstExempted: false });
		  break;
		default:
		  return;
	  }
	}
  
	// route tax update in dashboard
  
	routeTaxUpdate2() {
	  let code = this.taxOption;
	  if (code) {
		this.updateDashboardGstExemptedStatus({ isGstExempted: true });
	  } else {
		this.updateDashBoardTaxDetails();
	  }
	}
  
	/**
	 *  Update Tax details
	 */
  
	updateTaxDetails() {
	  this.errorMessage[2] = "";
	  this.taxForm1.submitted = true;
	  if (this.taxDetailsForm.invalid) {
		// this.toastr.warning('invalid form');
		return;
	  }
	  this.spinner[2] = true;
	  this.vendorDetailsService
		.updateTaxDetails(this.taxDetailsForm.getRawValue())
		.pipe(takeUntil(this.destroyed$))
		.subscribe(
		  (payload) => {
			var response = JSON.parse(JSON.stringify(payload));
			this.spinner[2] = false;
			if (!response.error) {
			  this.toastr.success(response.message);
			  this.ngOnInit();
			  this.router
				.navigateByUrl("/start-seller", { skipLocationChange: true })
				.then(() => {
				  this.router.navigate(["/start-seller"]);
				});
			} else {
			  this.errorMessage[2] = response.message;
			}
		  },
		  (error) => {
			this.toastr.error(error.status + " : " + error.statusText);
			this.spinner[2] = false;
		  }
		);
	}
  
	/**
	 *  Update Shipping Fee
	 */
  
	updateShippingFee() {
	  this.errorMessage[3] = "";
	  if (this.shippingFeeForm.invalid) {
		return;
	  }
	  this.spinner[3] = true;
	  this.vendorDetailsService
		.updateShippingFee(this.shippingFeeForm.getRawValue())
		.pipe(takeUntil(this.destroyed$))
		.subscribe(
		  (payload) => {
			var response = JSON.parse(JSON.stringify(payload));
			this.spinner[3] = false;
			if (!response.error) {
			  this.toastr.success(response.message);
			  this.ngOnInit();
			  this.router
				.navigateByUrl("/start-seller", { skipLocationChange: true })
				.then(() => {
				  this.router.navigate(["/start-seller"]);
				});
			} else {
			  this.errorMessage[3] = response.message;
			}
		  },
		  (error) => {
			this.toastr.error(error.status + " : " + error.statusText);
			this.spinner[3] = false;
		  }
		);
	}
  
	/**
	 * Update Bank Details
	 */
  
	updateBankDetails() {
	  this.errorMessage[4] = "";
	  if (this.bankAccountForm.invalid) {
		return;
	  }
	  this.spinner[4] = true;
	  this.vendorDetailsService
		.updateBankDetails(this.bankAccountForm.getRawValue())
		.pipe(takeUntil(this.destroyed$))
		.subscribe(
		  (payload) => {
			var response = JSON.parse(JSON.stringify(payload));
			this.spinner[4] = false;
			if (!response.error) {
			  this.toastr.success(response.message);
			  this.ngOnInit();
			  this.router
				.navigateByUrl("/start-seller", { skipLocationChange: true })
				.then(() => {
				  this.router.navigate(["/start-seller"]);
				});
			} else {
			  this.errorMessage[4] = response.message;
			}
		  },
		  (error) => {
			this.toastr.error(error.status + " : " + error.statusText);
			this.spinner[4] = false;
		  }
		);
	}
  
	/**
	 *  Update Product Tax Code
	 */
  
	// updateProductTaxCode() {
	// 	this.errorMessage[6] = '';
	// 	if (!this.isChecked[1]) {
	// 		this.errorMessage[6] = 'Please tick on the above checkbox.';
	// 		return;
	// 	}
	// 	this.spinner[6] = true;
	// 	let taxdata = this.productTaxCodeForm.getRawValue().productTaxCode.split('@');
	// 	let obj = {
	// 		productTaxCode: taxdata[0],
	// 		taxCodePercentage: taxdata[1]
	// 	}
	// 	this.vendorDetailsService.updateProductTaxCode(obj)
	// 		.pipe(takeUntil(this.destroyed$))
	// 		.subscribe((payload) => {
	// 			var response = JSON.parse(JSON.stringify(payload));
	// 			this.spinner[6] = false;
	// 			if (!response.error) {
	// 				this.toastr.success(response.message);
	// 				this.ngOnInit();
	// 				this.router.navigateByUrl('/start-seller', { skipLocationChange: true }).then(() => {
	// 					this.router.navigate(['/start-seller']);
	// 				});
	// 			}
	// 			else {
	// 				this.errorMessage[6] = response.message;
	// 			}
	// 		}, (error) => {
	// 			this.toastr.error(error.status + " : " + error.statusText);
	// 			this.spinner[6] = false;
	// 		});
	// }
  
	/**
	 *  update GST exempted status
	 */
  
	updateGstExemptedStatus(status) {
	  this.errorMessage[2] = "";
	  this.spinner[2] = true;
	  this.vendorDetailsService
		.updateGstExemptedStatus(status)
		.pipe(takeUntil(this.destroyed$))
		.subscribe(
		  (payload) => {
			var response = JSON.parse(JSON.stringify(payload));
			this.spinner[2] = false;
			if (!response.error) {
			  this.toastr.success(response.message);
			  this.ngOnInit();
			  this.router
				.navigateByUrl("/start-seller", { skipLocationChange: true })
				.then(() => {
				  this.router.navigate(["/start-seller"]);
				});
			} else {
			  this.errorMessage[2] = response.message;
			}
		  },
		  (error) => {
			this.toastr.error(error.status + " : " + error.statusText);
			this.spinner[2] = false;
		  }
		);
	}
  
	/**
	 *  Update Tax details
	 */
  
	updateDashBoardTaxDetails() {
	  this.errorMessage[5] = "";
	  this.taxForm2.submitted = true;
	  if (this.taxDetailsForm2.invalid) {
		// this.toastr.warning('invalid form');
		return;
	  }
	  this.spinner[5] = true;
	  this.vendorDetailsService
		.updateTaxDetails(this.taxDetailsForm2.getRawValue())
		.pipe(takeUntil(this.destroyed$))
		.subscribe(
		  (payload) => {
			var response = JSON.parse(JSON.stringify(payload));
			this.spinner[5] = false;
			if (!response.error) {
			  this.toastr.success(response.message);
			  this.ngOnInit();
			  this.router
				.navigateByUrl("/start-seller", { skipLocationChange: true })
				.then(() => {
				  this.router.navigate(["/start-seller"]);
				});
			} else {
			  this.errorMessage[5] = response.message;
			}
		  },
		  (error) => {
			this.toastr.error(error.status + " : " + error.statusText);
			this.spinner[5] = false;
		  }
		);
	}
  
	/**
	 *  update GST exempted status
	 */
  
	updateDashboardGstExemptedStatus(status) {
	  this.errorMessage[5] = "";
	  this.spinner[5] = true;
	  this.vendorDetailsService
		.updateGstExemptedStatus(status)
		.pipe(takeUntil(this.destroyed$))
		.subscribe(
		  (payload) => {
			var response = JSON.parse(JSON.stringify(payload));
			this.spinner[5] = false;
			if (!response.error) {
			  this.toastr.success(response.message);
			  this.ngOnInit();
			  this.router
				.navigateByUrl("/start-seller", { skipLocationChange: true })
				.then(() => {
				  this.router.navigate(["/start-seller"]);
				});
			} else {
			  this.errorMessage[5] = response.message;
			}
		  },
		  (error) => {
			this.toastr.error(error.status + " : " + error.statusText);
			this.spinner[5] = false;
		  }
		);
	}
  
	updateProductCategory() {
	  const selectedCategoryIds = this.productCategoryForm.value.orders
		.map((v, i) => (v ? this.orders[i]._id : null))
		.filter((value) => value !== null);
	  console.log(selectedCategoryIds);
	  console.log(this.categoryArr);
  
	  function containsAll(needles, haystack) {
		for (var i = 0; i < needles.length; i++) {
		  if ($.inArray(needles[i], haystack) == -1) return false;
		}
		return true;
	  }
  
	  if(!containsAll(this.categoryArr,selectedCategoryIds))
	  {
		  alert("You can not unselect previous category")
  
		  return false;
	  
  
	  }
  
	  let obj = {
		ProductCategoryId: selectedCategoryIds,
	  };
	  // this.errorMessage[13] = '';
	  this.spinner[13] = true;
	  this.vendorDetailsService
		.updateProductCategory(obj)
		.pipe(takeUntil(this.destroyed$))
		.subscribe(
		  (payload) => {
			var response = JSON.parse(JSON.stringify(payload));
			this.spinner[13] = false;
			if (!response.error) {
			  this.toastr.success(response.message);
			  this.ngOnInit();
			  this.router
				.navigateByUrl("/start-seller", { skipLocationChange: true })
				.then(() => {
				  this.router.navigate(["/start-seller"]);
				});
			} else {
			  // this.errorMessage[13] = response.message;
			}
		  },
		  (error) => {
			this.toastr.error(error.status + " : " + error.statusText);
			this.spinner[13] = false;
		  }
		);
	}
  
	minSelectedCheckboxes(min = 0) {
	  const validator: ValidatorFn = (formArray: FormArray) => {
		const totalSelected = formArray.controls
		  .map((control) => control.value)
		  .reduce((prev, next) => (next ? prev + next : prev), 0);
		return totalSelected == min ? { min: true } : null;
	  };
  
	  return validator;
	}
  
	maxSelectedCheckboxes(max = 3) {
	  const validator: ValidatorFn = (formArray: FormArray) => {
		const totalSelected = formArray.controls
		  .map((control) => control.value)
		  .reduce((prev, next) => (next ? prev + next : prev), 0);
		return totalSelected > max ? { max: true } : null;
	  };
  
	  return validator;
	}
  
	/**
	 * Get state list
	 */
  
	getStates() {
	  this.stateList = [];
	  this.vendorDetailsService
		.getStates({ country: "India" })
		.pipe(takeUntil(this.destroyed$))
		.subscribe(
		  (payload) => {
			var response = JSON.parse(JSON.stringify(payload));
			if (!response.error) {
			  this.stateList = response.data.state_list;
			  // console.log(response);
			}
		  },
		  (error) => {
			// this.toastr.error(error.status + " : " + error.statusText);
		  }
		);
	}
  
	// route signature image upload
  
	routeImageUpload() {
	  let code = this.selectedImageUploadOption;
	  if (code === 0) {
		this.updateSignature();
	  } else if (code === 1) {
		this.updateSignatureDraw();
	  } else {
		return;
	  }
	}
  
	/**
	 * Save Signature drawing
	 */
  
	updateSignatureDraw() {
	  let signature = this.signaturePad.toDataURL();
	  let file: File = this.convertToImage(signature, "signature");
	  this.spinner[7] = true;
	  const formData: FormData = new FormData();
	  formData.append("signature", file);
	  this.vendorDetailsService
		.updateSignature(formData)
		.pipe(takeUntil(this.destroyed$))
		.subscribe(
		  (payload) => {
			var response = JSON.parse(JSON.stringify(payload));
			this.spinner[7] = false;
			if (!response.error) {
			  this.toastr.success(response.message);
			  this.ngOnInit();
			  this.router
				.navigateByUrl("/start-seller", { skipLocationChange: true })
				.then(() => {
				  this.router.navigate(["/start-seller"]);
				});
			} else {
			  this.errorMessage[7] = response.message;
			}
		  },
		  (error) => {
			this.toastr.error(error.status + " : " + error.statusText);
			// console.log(error)
			this.spinner[7] = false;
		  }
		);
	}
  
	/**
	 * Update Signature
	 */
  
	updateSignature() {
	  this.errorMessage[7] = "";
	  if (!this.file) {
		this.sizeExceed[0] = "Please choose a file.";
		return;
	  }
	  this.spinner[7] = true;
	  this.sizeExceed[0] = "";
	  const formData: FormData = new FormData();
	  formData.append("signature", this.file);
	  this.vendorDetailsService
		.updateSignature(formData)
		.pipe(takeUntil(this.destroyed$))
		.subscribe(
		  (payload) => {
			var response = JSON.parse(JSON.stringify(payload));
			this.spinner[7] = false;
			if (!response.error) {
			  this.toastr.success(response.message);
			  this.ngOnInit();
			  this.router
				.navigateByUrl("/start-seller", { skipLocationChange: true })
				.then(() => {
				  this.router.navigate(["/start-seller"]);
				});
			} else {
			  this.errorMessage[7] = response.message;
			}
		  },
		  (error) => {
			this.toastr.error(error.status + " : " + error.statusText);
			// console.log(error)
			this.spinner[7] = false;
		  }
		);
	}
  
	/**
	 *  Get Signature URL
	 */
  
	getSignatureURL() {
	  this.vendorDetailsService
		.getSignatureURL()
		.pipe(takeUntil(this.destroyed$))
		.subscribe(
		  (payload) => {
			var response = JSON.parse(JSON.stringify(payload));
			if (!response.error) {
			  this.mySignature = response.data.imageUrl;
			  this.updateFlags[4] = false;
			} else {
			  this.mySignature = "";
			}
		  },
		  (error) => {
			// this.toastr.error(error.status + " : " + error.statusText);
			// console.log(error)
			this.mySignature = "";
		  }
		);
	}
  
	/**
	 *  Get food license URL
	 */
  
	getFoodLicenseURL() {
	  let params = {
		docName: "foodLicense",
	  };
	  this.vendorDetailsService
		.getVendorPrivateFileURL(params)
		.pipe(takeUntil(this.destroyed$))
		.subscribe(
		  (payload) => {
			var response = JSON.parse(JSON.stringify(payload));
			if (!response.error) {
			  this.myFoodLicense = response.data.fileUrl;
			  this.updateFlags[5] = false;
			} else {
			  this.myFoodLicense = "";
			}
		  },
		  (error) => {
			// this.toastr.error(error.status + " : " + error.statusText);
			// console.log(error)
			this.myFoodLicense = "";
		  }
		);
	}
  
	/**
	 *  Upload food license file
	 */
  
	uploadFoodLicense() {
	  this.errorMessage[8] = "";
	  if (!this.foodLicense) {
		this.sizeExceed[1] = "Please choose a file.";
		return;
	  }
	  this.spinner[8] = true;
	  this.sizeExceed[1] = "";
	  const formData: FormData = new FormData();
	  formData.append("docName", "foodLicense");
	  formData.append("sellerFile", this.foodLicense);
	  this.vendorDetailsService
		.uploadVendorPrivateFile(formData)
		.pipe(takeUntil(this.destroyed$))
		.subscribe(
		  (payload) => {
			var response = JSON.parse(JSON.stringify(payload));
			this.spinner[8] = false;
			if (!response.error) {
			  this.toastr.success(response.message);
			  this.ngOnInit();
			  this.router
				.navigateByUrl("/start-seller", { skipLocationChange: true })
				.then(() => {
				  this.router.navigate(["/start-seller"]);
				});
			} else {
			  this.errorMessage[8] = response.message;
			}
		  },
		  (error) => {
			this.toastr.error(error.status + " : " + error.statusText);
			// console.log(error)
			this.spinner[8] = false;
		  }
		);
	}
  
	/**
	 *  Get gst license URL
	 */
  
	getGSTLicenseURL() {
	  let params = {
		docName: "gstLicense",
	  };
	  this.vendorDetailsService
		.getVendorPrivateFileURL(params)
		.pipe(takeUntil(this.destroyed$))
		.subscribe(
		  (payload) => {
			var response = JSON.parse(JSON.stringify(payload));
			if (!response.error) {
			  this.myGstLicense = response.data.fileUrl;
			  this.updateFlags[6] = false;
			} else {
			  this.myGstLicense = "";
			}
		  },
		  (error) => {
			// this.toastr.error(error.status + " : " + error.statusText);
			// console.log(error)
			this.myGstLicense = "";
		  }
		);
	}
  
	/**
	 *  Upload gst license file
	 */
  
	uploadGSTLicense() {
	  this.errorMessage[9] = "";
	  if (!this.gstLicense) {
		this.sizeExceed[2] = "Please choose a file.";
		return;
	  }
	  this.spinner[9] = true;
	  this.sizeExceed[2] = "";
	  const formData: FormData = new FormData();
	  formData.append("docName", "gstLicense");
	  formData.append("sellerFile", this.gstLicense);
	  this.vendorDetailsService
		.uploadVendorPrivateFile(formData)
		.pipe(takeUntil(this.destroyed$))
		.subscribe(
		  (payload) => {
			var response = JSON.parse(JSON.stringify(payload));
			this.spinner[9] = false;
			if (!response.error) {
			  this.toastr.success(response.message);
			  this.ngOnInit();
			  this.router
				.navigateByUrl("/start-seller", { skipLocationChange: true })
				.then(() => {
				  this.router.navigate(["/start-seller"]);
				});
			} else {
			  this.errorMessage[9] = response.message;
			}
		  },
		  (error) => {
			this.toastr.error(error.status + " : " + error.statusText);
			// console.log(error)
			this.spinner[9] = false;
		  }
		);
	}
  
	/**
	 *  Get shop license URL
	 */
  
	getShopLicenseURL() {
	  let params = {
		docName: "shopLicense",
	  };
	  this.vendorDetailsService
		.getVendorPrivateFileURL(params)
		.pipe(takeUntil(this.destroyed$))
		.subscribe(
		  (payload) => {
			var response = JSON.parse(JSON.stringify(payload));
			if (!response.error) {
			  this.myShopLicense = response.data.fileUrl;
			  this.updateFlags[7] = false;
			} else {
			  this.myShopLicense = "";
			}
		  },
		  (error) => {
			// this.toastr.error(error.status + " : " + error.statusText);
			// console.log(error)
			this.myShopLicense = "";
		  }
		);
	}
  
	/**
	 *  Upload shop license file
	 */
  
	uploadShopLicense() {
	  this.errorMessage[10] = "";
	  if (!this.shopLicense) {
		this.sizeExceed[3] = "Please choose a file.";
		return;
	  }
	  this.spinner[10] = true;
	  this.sizeExceed[3] = "";
	  const formData: FormData = new FormData();
	  formData.append("docName", "shopLicense");
	  formData.append("sellerFile", this.shopLicense);
	  this.vendorDetailsService
		.uploadVendorPrivateFile(formData)
		.pipe(takeUntil(this.destroyed$))
		.subscribe(
		  (payload) => {
			var response = JSON.parse(JSON.stringify(payload));
			this.spinner[10] = false;
			if (!response.error) {
			  this.toastr.success(response.message);
			  this.ngOnInit();
			  this.router
				.navigateByUrl("/start-seller", { skipLocationChange: true })
				.then(() => {
				  this.router.navigate(["/start-seller"]);
				});
			} else {
			  this.errorMessage[10] = response.message;
			}
		  },
		  (error) => {
			this.toastr.error(error.status + " : " + error.statusText);
			// console.log(error)
			this.spinner[10] = false;
		  }
		);
	}
  
	/**
	 *  Get blank cheque URL
	 */
  
	getBlankchequeURL() {
	  let params = {
		docName: "blankCheque",
	  };
	  this.vendorDetailsService
		.getVendorPrivateFileURL(params)
		.pipe(takeUntil(this.destroyed$))
		.subscribe(
		  (payload) => {
			var response = JSON.parse(JSON.stringify(payload));
			if (!response.error) {
			  this.myBlankCheque = response.data.fileUrl;
			  this.updateFlags[8] = false;
			} else {
			  this.myBlankCheque = "";
			}
		  },
		  (error) => {
			// this.toastr.error(error.status + " : " + error.statusText);
			// console.log(error)
			this.myBlankCheque = "";
		  }
		);
	}
  
	/**
	 *  Upload blank cheque file
	 */
  
	uploadBlankCheque() {
	  this.errorMessage[11] = "";
	  if (!this.blankCheque) {
		this.sizeExceed[4] = "Please choose a file.";
		return;
	  }
	  this.spinner[11] = true;
	  this.sizeExceed[4] = "";
	  const formData: FormData = new FormData();
	  formData.append("docName", "blankCheque");
	  formData.append("sellerFile", this.blankCheque);
	  this.vendorDetailsService
		.uploadVendorPrivateFile(formData)
		.pipe(takeUntil(this.destroyed$))
		.subscribe(
		  (payload) => {
			var response = JSON.parse(JSON.stringify(payload));
			this.spinner[11] = false;
			if (!response.error) {
			  this.toastr.success(response.message);
			  this.ngOnInit();
			  this.router
				.navigateByUrl("/start-seller", { skipLocationChange: true })
				.then(() => {
				  this.router.navigate(["/start-seller"]);
				});
			} else {
			  this.errorMessage[11] = response.message;
			}
		  },
		  (error) => {
			this.toastr.error(error.status + " : " + error.statusText);
			// console.log(error)
			this.spinner[11] = false;
		  }
		);
	}
  
	/**
	 *  Detect filechange event for signature upload
	 */
  
	fileChange(event) {
	  this.file = null;
	  this.sizeExceed[0] = "";
	  let fileList: FileList = event.target.files;
	  if (fileList.length > 0) {
		let type = fileList[0].type;
		let size = Math.round(fileList[0].size / 1024);
		if (type != "image/jpeg" && type != "image/png") {
		  this.sizeExceed[0] = "Image should be in .jpeg or .png format.";
		} else {
		  if (size > 500) {
			this.sizeExceed[0] =
			  "File too Big, please select a file less than 500KB.";
		  } else {
			this.file = fileList[0];
		  }
		}
	  }
	}
  
	/**
	 *  Detect filechange event for food license upload
	 */
  
	fileChange2(event) {
	  this.foodLicense = null;
	  this.sizeExceed[1] = "";
	  let fileList: FileList = event.target.files;
	  if (fileList.length > 0) {
		let type = fileList[0].type;
		let size = Math.round(fileList[0].size / 1024);
		if (type != "image/jpeg" && type != "image/png") {
		  this.sizeExceed[1] = "Image should be in .jpeg or .png format.";
		} else {
		  if (size > 500) {
			this.sizeExceed[1] =
			  "File too Big, please select a file less than 500KB.";
		  } else {
			this.foodLicense = fileList[0];
		  }
		}
	  }
	}
  
	/**
	 *  Detect filechange event for GST license upload
	 */
  
	fileChange3(event) {
	  this.gstLicense = null;
	  this.sizeExceed[2] = "";
	  let fileList: FileList = event.target.files;
	  if (fileList.length > 0) {
		let type = fileList[0].type;
		let size = Math.round(fileList[0].size / 1024);
		if (type != "image/jpeg" && type != "image/png") {
		  this.sizeExceed[2] = "Image should be in .jpeg or .png format.";
		} else {
		  if (size > 500) {
			this.sizeExceed[2] =
			  "File too Big, please select a file less than 500KB.";
		  } else {
			this.gstLicense = fileList[0];
		  }
		}
	  }
	}
  
	/**
	 *  Detect filechange event for shop license upload
	 */
  
	fileChange4(event) {
	  this.shopLicense = null;
	  this.sizeExceed[3] = "";
	  let fileList: FileList = event.target.files;
	  if (fileList.length > 0) {
		let type = fileList[0].type;
		let size = Math.round(fileList[0].size / 1024);
		if (type != "image/jpeg" && type != "image/png") {
		  this.sizeExceed[3] = "Image should be in .jpeg or .png format.";
		} else {
		  if (size > 500) {
			this.sizeExceed[3] =
			  "File too Big, please select a file less than 500KB.";
		  } else {
			this.shopLicense = fileList[0];
		  }
		}
	  }
	}
  
	/**
	 *  Detect filechange event for blank cheque upload
	 */
  
	fileChange5(event) {
	  this.blankCheque = null;
	  this.sizeExceed[4] = "";
	  let fileList: FileList = event.target.files;
	  if (fileList.length > 0) {
		let type = fileList[0].type;
		let size = Math.round(fileList[0].size / 1024);
		if (type != "image/jpeg" && type != "image/png") {
		  this.sizeExceed[4] = "Image should be in .jpeg or .png format.";
		} else {
		  if (size > 500) {
			this.sizeExceed[4] =
			  "File too Big, please select a file less than 500KB.";
		  } else {
			this.blankCheque = fileList[0];
		  }
		}
	  }
	}
  
	/**
	 *  Clear signature pad.
	 */
  
	clearSignaturePad() {
	  this.signaturePad.clear();
	}
  
	/**
	 *  convert data url to file
	 */
  
	convertToImage(dataURL, fileName) {
	  var arr = dataURL.split(","),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);
  
	  while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	  }
	  return new File([u8arr], fileName, { type: mime });
	}
  
	/**
	 * Get Product tax codes
	 */
  
	getProductTaxCodes() {
	  this.productTaxCodes = [];
	  this.vendorDetailsService
		.getProductTaxCodes()
		.pipe(takeUntil(this.destroyed$))
		.subscribe(
		  (payload) => {
			var response = JSON.parse(JSON.stringify(payload));
			if (!response.error) {
			  this.productTaxCodes = response.data.utility_data;
			  // console.log(response);
			}
		  },
		  (error) => {
			// this.toastr.error(error.status + " : " + error.statusText);
		  }
		);
	}
  
	/**
	 * Get Product Category
	 */
  
	getCategories(parentId = "") {
	  let params: JsonObject = { id: parentId };
	  this.vendorDetailsService.getMainCategory(params).subscribe(
		(response) => {
		  this.BrowseCategory = response.data.categories;
		},
		(error: any) => {
		  this.toastr.error(error.status + " : " + error.statusText);
		}
	  );
	}
  
	get companyNameControl() {
	  return this.companyNameForm.controls;
	}
  
	get sellerRegisterControl() {
	  return this.registerSellerForm.controls;
	}
  
	taxHasError(controlName: string, errorName: string) {
	  return this.taxDetailsForm.controls[controlName].hasError(errorName);
	}
  
	tax2HasError(controlName: string, errorName: string) {
	  return this.taxDetailsForm2.controls[controlName].hasError(errorName);
	}
  
	shippingHasError(controlName: string, errorName: string) {
	  return this.shippingFeeForm.controls[controlName].hasError(errorName);
	}
  
	bankAccountHasError(controlName: string, errorName: string) {
	  return this.bankAccountForm.controls[controlName].hasError(errorName);
	}
  
	productTaxCodeHasError(controlName: string, errorName: string) {
	  return this.productTaxCodeForm.controls[controlName].hasError(errorName);
	}
  
	updateProductCategoryError(controlName: string, errorName: string) {
	  return this.productCategoryForm.controls[controlName].hasError(errorName);
	}
  
	@HostListener("window:beforeunload")
	async ngOnDestroy() {
	  this.destroyed$.next(true);
	  this.destroyed$.complete();
	}
  
	onLaunchYourBusinessClick() {
	  this.router.navigateByUrl("/seller-home");
	}
  
	requestForAdminApprove() {
	  let result = this.isPending();
	  if (result) {
		this.toastr.warning("Please update all documents");
		return;
	  }
	  this.vendorDetailsService
		.requestAdminApproval()
		.pipe(takeUntil(this.destroyed$))
		.subscribe(
		  (payload) => {
			var response = JSON.parse(JSON.stringify(payload));
			if (!response.error) {
			  this.toastr.success(response.message);
			  this.ngOnInit();
			  this.router
				.navigateByUrl("/", { skipLocationChange: true })
				.then(() => {
				  this.router.navigate(["/start-seller"]);
				});
			} else {
			  this.toastr.error(response.message);
			}
		  },
		  (error) => {
			this.toastr.error(error.status + " : " + error.statusText);
		  }
		);
	}
  
	isPending() {
	  let result = true;
	  if (
		this.vendorData.signature_file_name &&
		this.vendorData.food_license_file_name &&
		this.vendorData.GST_license_file_name &&
		this.vendorData.shop_license_file_name &&
		this.vendorData.blank_cheque_file_name &&
		this.shippingFeeForm.valid &&
		this.bankAccountForm.valid &&
		(this.taxDetailsForm2.valid || this.taxOption) &&
		this.productTaxCodeForm.valid &&
		this.productCategoryForm.valid
	  ) {
		result = false;
	  }
	  return result;
	}
  }
  