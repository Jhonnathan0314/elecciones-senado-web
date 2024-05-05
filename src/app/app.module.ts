import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SecretHeaderInterceptor } from './core/interceptors/secret-header/secret-header.interceptor';
import { TokenInterceptor } from './core/interceptors/token/token.interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, 
      useClass: SecretHeaderInterceptor, 
      multi: true 
    },
    { provide: HTTP_INTERCEPTORS, 
      useClass: TokenInterceptor, 
      multi: true 
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
