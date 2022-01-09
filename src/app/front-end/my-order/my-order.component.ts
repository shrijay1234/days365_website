import { Component, OnInit } from '@angular/core';
import  {OrderService} from 'app/services/order.service';
import { LocalStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.css']
})
export class MyOrderComponent implements OnInit {
  items:any= [];
  constructor(private orderService: OrderService, private local:LocalStorageService, private router:Router) { 
    const accessToken = this.local.retrieve('accessToken');
		if (accessToken==null || accessToken=='') {
			this.router.navigate(['/login']);
		}
  }

  ngOnInit(): void {
    this.getOrders();
  }

  orderDetails(id:number){
    this.router.navigate(['/order-detail', { id: id }]);
  }

  getOrders(){
    this.orderService.orders({}).subscribe((payload: any) => {
			var response = JSON.parse(JSON.stringify(payload));
      console.log(response)
      if(!response.error){
        this.items = response.data
      }
      

		}, error => {
		  console.log(error);
		});
  }

}
