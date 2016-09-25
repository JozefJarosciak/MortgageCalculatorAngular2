import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppComponent}  from './app.component';
import {ChartModule} from 'primeng/primeng';

@NgModule({
  imports: [BrowserModule, FormsModule, ReactiveFormsModule,ChartModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
