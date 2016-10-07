import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppComponent}  from './app.component';
import {RootComponent}  from './root.component';
import {ChartModule} from 'primeng/primeng';
import {TooltipModule} from 'primeng/primeng';
import { routing, mainRoutingProviders } from './main.routes';

@NgModule({
  imports: [
    BrowserModule,
    ChartModule,
    FormsModule,
    mainRoutingProviders,
    ReactiveFormsModule,
    routing,
    TooltipModule
  ],
  declarations: [AppComponent, RootComponent],
  bootstrap: [RootComponent]
})
export class AppModule {
}
