import { Component,ViewChild, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { LocalStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SellerAccountService } from '../../services/seller-account.service';
import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';


@Component({
  selector: 'app-promo-code-details',
  templateUrl: './promo-code-details.component.html',
  styleUrls: ['./promo-code-details.component.css']
})
export class PromoCodeDetailsComponent implements OnInit {

  displayedColumns: string[] = ['_id','promoterName', 'sellerName', 'brandName', 'promoCode','percentageOnBrand','createdAt'];
  dataSource: any;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  getAllPromoCodeList() {
    //let params: JsonObject = { "status": ["Pending"]};
    this.PromoterService.getPromoCodeList()
      .subscribe((payload) => {
        var response = JSON.parse(JSON.stringify(payload));
        if (!response.error) {
          this.dataSource = new MatTableDataSource(response.data);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator; 
        } else {
          this.toastr.error(response.message);
        }
      }, (error) => {
        this.toastr.error(error.status + " : " + error.statusText);
      });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  constructor(public dialog: MatDialog,  
    private PromoterService:SellerAccountService,
    private local: LocalStorageService,
    private router: Router,
    private toastr: ToastrService) {
      let accessToken = this.local.retrieve('accessToken');
		  let type = this.local.retrieve('type');
      if (!accessToken || type !== 'vendor') {
        this.router.navigateByUrl('/');
      }
      this.getAllPromoCodeList();
     }

  ngOnInit(): void {
  }

}
