import {Injectable, ElementRef} from '@angular/core';
import {Observable} from "rxjs";

import {Http, URLSearchParams } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export class NamedDescription {
    constructor(
        public name: string,
        public text: string) {
    }
}

@Injectable()
export class NeuronService {
    static navbarElement: ElementRef;

    constructor(private http: HttpClient) {}

    getMainText() {
        let reqHeaders = new HttpHeaders({
          'Accept':'plain/text'
        });
        return this.http.get('/index.html', {headers: reqHeaders, responseType: 'text'});
    }

    getNetworkModel() {
        let reqHeaders = new HttpHeaders({
          'Accept':'application/json'
        });
        //return this.http.get('/assets/csvexample-layers.json', {headers: reqHeaders, responseType: 'json'});
        //return this.http.get('assets/csvexample-layers.json', {headers: reqHeaders, responseType: 'json'});
        //return this.http.get('/assets/regression-math-layers.json', {headers: reqHeaders, responseType: 'json'});
        return this.http.get('/assets/csvexample-30-layers.json', {headers: reqHeaders, responseType: 'json'});
    }

    getNavbarHeight(): number {
        if(NeuronService.navbarElement == null) {
          return 0;
        }
        return NeuronService.navbarElement.nativeElement.offsetHeight;
    }

    getAboutDescription(): NamedDescription {
        return new NamedDescription("about", "Fun with Neurons Network");
    }
}