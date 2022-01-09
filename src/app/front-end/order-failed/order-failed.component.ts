import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-order-failed',
  templateUrl: './order-failed.component.html',
  styleUrls: ['./order-failed.component.css']
})
export class OrderFailedComponent implements OnInit {

  constructor(private local: LocalStorageService, private router:Router) { }

  ngOnInit(): void {
    if(!this.local.retrieve('orderprocess')){
      this.router.navigateByUrl('/');
    }else{
      this.local.store('orderprocess', 0);
    }
  }

}
