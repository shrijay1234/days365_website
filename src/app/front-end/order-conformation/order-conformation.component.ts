import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';
import { OrderService } from 'app/services/order.service';

@Component({
  selector: 'app-order-conformation',
  templateUrl: './order-conformation.component.html',
  styleUrls: ['./order-conformation.component.css']
})
export class OrderConformationComponent implements OnInit {

  constructor(private local: LocalStorageService, private router:Router, private orderService: OrderService) { }

  ngOnInit(): void {
    if(this.local.retrieve('orderprocess')){
      this.orderService.clearCart({"saveType":'cart'}).subscribe((payload: any) => {
        
        if(!payload.error){
          this.local.store('orderprocess', 0);
        }
  
      }, error => {
        console.log(error);
      });
      
    }else{
      this.router.navigateByUrl('/');
      
    }
  }

}
