import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor } from "@angular/common/http";
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})

export class TokenInterceptorService implements HttpInterceptor {

    protected readonly DISABLED__URLS = [
        'signin'
    ];
    private _requests = 0;

    constructor(private status: HTTPStatus) { }

    intercept(req, next) {

        ++this._requests;
        this.status.setHttpStatus(true);

        if (this.isNotInterceptableUrl(req)) {
            return next.handle(req)
            .pipe(
                map(event => {
                    return event;
                }),
                catchError(error => {
                    return throwError(error);
                }),
                finalize(() => {
                    --this._requests;
                    this.status.setHttpStatus(this._requests > 0);
                })
            )
        }

        let token = window.localStorage.getItem('token');
        let tokenizedReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            }
        });
       
        return next.handle(tokenizedReq)
            .pipe(
                map(event => {
                    return event;
                }),
                catchError(error => {
                    return throwError(error);
                }),
                finalize(() => {
                    --this._requests;
                    this.status.setHttpStatus(this._requests > 0);
                })
            )
    }

    private isNotInterceptableUrl(req) {
        return this.DISABLED__URLS.find((url) => req.url.includes(url));
    }
}

@Injectable()
export class HTTPStatus {
    private requestInFlight$: BehaviorSubject<boolean>;
    constructor() {
        this.requestInFlight$ = new BehaviorSubject(false);
    }

    setHttpStatus(inFlight: boolean) {
        this.requestInFlight$.next(inFlight);
    }

    getHttpStatus(): Observable<boolean> {
        return this.requestInFlight$.asObservable();
    }
}