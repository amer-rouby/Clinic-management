import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpEventType } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
// import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class SuccessInterceptor implements HttpInterceptor {

//   constructor(private toastr: ToastrService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(event => {
        if (event.type === HttpEventType.Response) {
            // console.log(HttpEventType);
            
        //   this.toastr.success(' تمت العمليه بنجاح!', 'Operation successful!', {
        //     timeOut: 3000,
        //     closeButton: true,
        //     progressBar: true 
        //   });
        }
      })
    );
  }
}

