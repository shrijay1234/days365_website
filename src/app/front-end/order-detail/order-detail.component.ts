import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { OrderService } from 'app/services/order.service';


@Component({

  
  
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']

  
})
export class OrderDetailComponent implements OnInit {
  itemdetails= [];
  trackingdetails;
  
  constructor(private orderService: OrderService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void { 
    
    this.getOrderDetails();
    
  }

  getOrderDetails(){
    let params = {};
    
    params['id'] = this.activatedRoute.snapshot.params.id;
    this.orderService.orderDetails(params).subscribe((payload: any) => {
			var response = JSON.parse(JSON.stringify(payload));
      console.log(response)
      if(!response.error){
        this.itemdetails = response.data;
        if(this.itemdetails['delivaryInfo']['delivaryTrakingId']){
          this.checkDeliveryStatus(this.itemdetails['delivaryInfo']['delivaryTrakingId']);
        }
        
      }

		}, error => {
		  console.log(error);
		});
  }

  checkDeliveryStatus(tarkingId){
    let params = {};
    
    params['TrackId'] = tarkingId;
    this.orderService.checkDeliveryStatus(params).subscribe((payload: any) => {
			var response = JSON.parse(JSON.stringify(payload));
      console.log("tis is response",response)
      if(!response.error){
        this.trackingdetails = response.data
      }

		}, error => {
		  console.log(error);
		});
  }

}
