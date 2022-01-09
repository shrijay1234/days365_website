import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adminheader',
  templateUrl: './adminheader.component.html',
  styleUrls: ['./adminheader.component.css']
})
export class AdminheaderComponent implements OnInit {

  constructor(private local: LocalStorageService, private router: Router) { }

  ngOnInit(): void {
  }


  signOut() {

    this.local.clear();
    this.router.navigateByUrl('/');
  }
}
