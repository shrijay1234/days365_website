import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpResponseBase } from "@angular/common/http";
import { LoginService } from "../services/login.service";
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { retry, catchError, tap, switchMap, filter, take } from "rxjs/operators";
import { LocalStorageService } from "ngx-webstorage";


@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);


  constructor(
    public loginService: LoginService,
    private local: LocalStorageService,
  ) { }


  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    httpRequest = this.addHeaders(httpRequest);
    // console.log("==================>2", httpRequest);
    return next.handle(httpRequest)
      .pipe(
        tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // console.log("event=======>", event);
          }
        }),
        catchError((error) => {
          if (error.status == 401) {
            // console.log("am 401", error.error.message);
            if (error.error.message == 'Access-Token expired') {
              if (this.refreshTokenInProgress) {
                return this.refreshTokenSubject
                  .pipe(
                    filter(result => result !== null),
                    take(1),
                    switchMap(() => {
                      return next.handle(this.addHeaders(httpRequest));
                    })
                  );
              }
              else {
                this.refreshTokenInProgress = true;
                this.refreshTokenSubject.next(null);
                return this.loginService.refreshAccessToken()
                  .pipe(switchMap((payload) => {
                    var response = JSON.parse(JSON.stringify(payload));
                    if (response.error === false && response.data) {
                      this.local.clear('accessToken');
                      this.local.clear('refreshToken');
                      this.local.store('accessToken', response.data.accessToken);
                      this.local.store('refreshToken', response.data.refreshToken);
                      this.refreshTokenInProgress = false;
                      this.refreshTokenSubject.next(true);
                      return next.handle(this.addHeaders(httpRequest));
                    }
                    else {
                      this.loginService.logout();
                      return throwError(error);
                    }
                  }),
                    catchError((error) => {
                      this.refreshTokenInProgress = false;
                      this.loginService.logout();
                      return throwError(error);
                    })
                  );
              }
            }
            else {
              // logout
              this.loginService.logout();
              return throwError(error);
            }
          }
          else {
            return throwError(error);
          }
        })
      );
  }


  addHeaders(httpRequest: HttpRequest<any>) {
    // console.log("hai=======1>", httpRequest);
    const accessToken = this.local.retrieve('accessToken');
    if (accessToken) {
      httpRequest = httpRequest.clone({ headers: httpRequest.headers.set('Authorization', 'Bearer ' + accessToken) });
    }
    if (!httpRequest.headers.has('Multi-Part-Request')) {
      if (!httpRequest.headers.has('Content-Type')) {
        httpRequest = httpRequest.clone({ headers: httpRequest.headers.set('Content-Type', 'application/json') });
      }
    }
    if (!httpRequest.headers.has('Accept')) {
      httpRequest = httpRequest.clone({ headers: httpRequest.headers.set('Accept', 'application/json') });
    }
    return httpRequest;
  }
}
