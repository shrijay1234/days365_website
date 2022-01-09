import { Component, OnInit } from '@angular/core';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-seller-header',
  templateUrl: './seller-header.component.html',
  styleUrls: ['./seller-header.component.css']
})
export class SellerHeaderComponent implements OnInit {

  sellername:string='';

  constructor(
    private local:LocalStorageService
  ) {
    
   }

  ngOnInit(): void {
    this.sellername = this.local.retrieve('fullname');
  }

}
