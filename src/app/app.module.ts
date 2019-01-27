import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {HttpModule} from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import NavbarComponent from './components/navbar/navbar';
import FooterComponent from './components/footer/footer';
import HomeComponent from './components/home/home';
import VRComponent from './components/vr/vr';
import AboutComponent from './components/about/about';
import NeuronViewComponent from './components/home/neurons-view';
import {NeuronService} from './services/neuron-service';
import {WanderService} from './services/wander-service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    VRComponent,
    AboutComponent,
    NeuronViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {path: '',                    component: HomeComponent},
      {path: 'vr',                  component: VRComponent},
      {path: 'model',               component: AboutComponent},
      {path: 'about',               component: AboutComponent}
    ])
  ],
  providers: [
     { provide: LocationStrategy, useClass: HashLocationStrategy },
     NeuronService,
     WanderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
