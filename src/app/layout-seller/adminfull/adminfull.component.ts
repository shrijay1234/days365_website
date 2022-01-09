import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { MenuItems } from '../../shared/menu-items/menu-items';
import { LocalStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';


@Component({
  selector: 'app-adminfull',
  templateUrl: './adminfull.component.html'
  // styleUrls: ['./adminfull.component.css']
})
export class AdminfullComponent implements OnInit {


  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef, 
    private local: LocalStorageService,
    private router: Router,
    media: MediaMatcher,
    public menuItems: MenuItems,

  ) {
     if (!this.local.get("token")) {
      this.router.navigateByUrl('/');
    }
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  ngAfterViewInit() { }


  ngOnInit(): void {
  }

}
