import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestService } from './services/test.service';
import { YmcaHeaderComponent } from './ymca-header/ymca-header.component';

@NgModule({
  declarations: [
    AppComponent,
    YmcaHeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [ HttpClientModule, TestService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
