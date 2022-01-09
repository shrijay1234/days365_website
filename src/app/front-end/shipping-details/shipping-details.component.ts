import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';
import { HomeService } from './../../services/home.service';
import  {PaymentService} from 'app/services/payment.service';
import {CourierService} from 'app/services/courier.service';

declare var $: any;

@Component({
	selector: 'app-shipping-details',
	templateUrl: './shipping-details.component.html',
	styleUrls: ['./shipping-details.component.css']
})
export class ShippingDetailsComponent implements OnInit {
	@ViewChild('form') form: ElementRef;

	favoriteSeason: string;
	seasons: string[] = ['Cash on Delivery', 'Phonepe', 'Online', 'Paytm',];
	registerForm: FormGroup;
	registerationForm: FormGroup;
	deliveryMethodForm : FormGroup;
	paymentMethodForm :  FormGroup;
	submitted = false;
	customerDetailsValidated: boolean = false;
	deliveryAddressFilled: boolean = false;
	deliveryMethodSelected: boolean = false;
	activeAccordion:number= 1;
	cartitems:any=[];
	paymentHtml : any;
	encRequest: String;
   	accessCode: String;
	submissionError: boolean = false;
	total:number=0;
	grandTotal:number=0;

	constructor(private formBuilder: FormBuilder, private local:LocalStorageService, private router: Router, private toast: ToastrService, private homeservice :HomeService, private paymentService:PaymentService, private courierService: CourierService) {
		let accessToken = this.local.retrieve('accessToken');
		let type = this.local.retrieve('type');
		if (!accessToken || type !== 'user') {
			this.router.navigateByUrl('/login');
    	}
	 }

	ngOnInit(): void {
		this.accessCode = "AVPA17II14AH62APHA";
		this.getCartItems();
		this.registerForm = this.formBuilder.group({
			title: ['', Validators.required],
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			mobile: ['', [Validators.required, Validators.minLength(10)]]
		});

		this.registerationForm = this.formBuilder.group({
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			mobile: ['', [Validators.required, Validators.minLength(10)]],
			state: ['', Validators.required],
			address: ['', Validators.required],
			city: ['', Validators.required],
			pin: ['', Validators.required],
		});

		this.deliveryMethodForm = this.formBuilder.group({
			delivery_method: ['', Validators.required],
		});
		this.paymentMethodForm = this.formBuilder.group({
			payment_mode: ['', Validators.required],
		});
	}
	get f() { return this.registerForm.controls; }
	get g() { return this.registerationForm.controls; }
	get h() { return this.deliveryMethodForm.controls; }
	get i() { return this.paymentMethodForm.controls; }

	onSubmit() {
		this.submitted = true;


		// stop here if form is invalid
		if (this.registerForm.invalid) {
			this.submissionError = true;
			return false;
		}
		this.submissionError = false;
		this.customerDetailsValidated = true;
		this.activeAccordion =2;
		console.log('customerDetailsValidated', this.customerDetailsValidated)
		console.log('activeAccordion', this.activeAccordion)
		console.log('submissionError',this.submissionError)

		// alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value))
	}

	getCartItems(){
		let params= {};
		params['saveType'] = 'cart';
		
		this.homeservice.getCartItems(params).subscribe((payload) => {
				var response = JSON.parse(JSON.stringify(payload));
				
				if(!response.error){
					this.cartitems = response.data;
					for (let i of this.cartitems) {
						
						for (let j of i.cartData.productVariant) {
							
							if(i.varientId==j._id){
								this.total+=j.yourPrice;
							}
						}
					}
					
					this.grandTotal = this.total;
				}
				//console.log("products : ", this.cartitems);
				if(!this.cartitems.length){
					// this.router.navigateByUrl('/');
				}
			}, (error) => {
				// this.toastr.error(error.status + " : " + error.statusText);
				console.log(error)
				// this.router.navigateByUrl('/');
			});
	  }

	deliveryMethodSubmit(){
		console.log("here")
		this.submitted = true;
		if (this.deliveryMethodForm.invalid) {
			//this.submissionError = true;
			return false;
		}
		this.submissionError = false;
		this.deliveryMethodSelected = true;
		this.activeAccordion =4;
		console.log('submissionError',this.submissionError)
	}

	inSubmit() {
		this.submitted = true;

		// stop here if form is invalid
		if (this.registerationForm.invalid) {
			this.submissionError = true;
			return;
		}
		this.submissionError = false;
		let pincode = this.registerationForm.value.pin;
		let param = {};
		param['pincode'] = pincode;
		
		this.courierService.pincodeCheck(param).subscribe((payload: any) => {
			var response = JSON.parse(JSON.stringify(payload));
			if(response.error){
				this.toast.error("Courier service is not available at this location");
				return false;
			}else{
				this.deliveryAddressFilled = true;
				this.activeAccordion =3;
				//alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value))
			}
		}, error => {
			this.toast.error("Courier service is not available at this location");
			return false;
		});
		console.log('submissionError',this.submissionError)
	}

	
	pay() {
		console.log('submissionError',this.submissionError)
		if(this.submissionError==true){
			this.toast.error("please fill all required fields");
			return false
		}

		let params={};
		var customerdetails = this.registerForm.value;
		var deliverydetails = this.registerationForm.value;

		
		params['customer_title'] = customerdetails.title;
		params['customer_name'] = customerdetails.firstName+' '+customerdetails.lastName;
		params['customer_first_name'] = customerdetails.firstName;
		params['customer_last_name'] = customerdetails.lastName;
		params['customer_email'] = customerdetails.email;
		params['customer_mobile'] = customerdetails.mobile;

		params['delivery_name'] = deliverydetails.firstName+' '+deliverydetails.lastName;
		params['delivery_first_name'] = deliverydetails.firstName;
		params['delivery_last_name'] = deliverydetails.lastName;
		params['delivery_email'] = deliverydetails.email;
		params['delivery_mobile'] = deliverydetails.mobile;
		params['delivery_address'] = deliverydetails.address;
		params['delivery_state'] = deliverydetails.state;
		params['delivery_city'] = deliverydetails.city;
		params['delivery_pin'] = deliverydetails.pin;

		params['shipping_charges'] = 0;
		params['total_amount'] = this.total;
		params['quantity'] = this.cartitems.length;

		this.paymentService.makePayment(params).subscribe((payload: any) => {
			
			var response = JSON.parse(JSON.stringify(payload));
			this.encRequest = response.data;
			//return false;
			this.local.store('orderprocess', 1);
		  
		  setTimeout(_ => this.form.nativeElement.submit());
		//   setTimeout(()=>{
		// 	this.form.nativeElement.submit()
		// }, 0);

		}, error => {
		  console.log(error);
		});
	}
}
