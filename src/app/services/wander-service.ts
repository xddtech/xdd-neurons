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
export class WanderService {

  static navbarElement: ElementRef;

  constructor(private http: HttpClient) {}

  getAboutDescription(): NamedDescription {
      return new NamedDescription("about", descriptions.about);
  }

  getMainText() {
    let reqHeaders = new HttpHeaders({
      'Accept':'plain/text'
    });
    return this.http.get('/index.html', {headers: reqHeaders, responseType: 'text'});
  }

  getNavbarHeight(): number {
    if(WanderService.navbarElement == null) {
      return 0;
    }
    return WanderService.navbarElement.nativeElement.offsetHeight;
  }
}

var descriptions = {
    "about": "Fun with Angular, Three.js and Typescript"
};
