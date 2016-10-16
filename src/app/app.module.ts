import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RootComponent}  from './root.component';
import {ChartModule} from 'primeng/primeng';
import {TooltipModule} from 'primeng/primeng';
import {ConfirmDialogModule} from 'primeng/primeng';
import { routing, mainRoutingProviders } from './app.component.routes';


import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent, RootComponent
  ],
  imports: [
    BrowserModule,
    ChartModule,
    FormsModule,
    mainRoutingProviders,
    ReactiveFormsModule,
    routing,
    TooltipModule,
    ConfirmDialogModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [RootComponent]
})
export class AppModule { }
