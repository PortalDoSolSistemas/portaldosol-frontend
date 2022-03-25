import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PoModule } from '@po-ui/ng-components';
import { PoTemplatesModule } from '@po-ui/ng-templates';
import { PoNavbarModule } from '@po-ui/ng-components';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService, HTTPStatus  } from './services/http.intercept';
import { NgxSpinnerModule } from 'ngx-spinner';
const RxJS_Services = [TokenInterceptorService, HTTPStatus];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PoModule,
    PoTemplatesModule,
    PoNavbarModule,
    BrowserAnimationsModule,
    NgxSpinnerModule
  ],
  providers: [
   //{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true }
   ...RxJS_Services,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptorService,
            multi: true
        }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
