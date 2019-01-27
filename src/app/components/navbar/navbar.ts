import {Component, ElementRef, ViewChild, AfterViewInit} from '@angular/core';

import {NeuronService} from '../../services/neuron-service';

@Component({
  selector: 'neuron-navbar',
  templateUrl: 'navbar.html',
  styleUrls: ['./navbar.css'],
  providers: [NeuronService]
})
export default class NavbarComponent implements AfterViewInit {
  @ViewChild('neuronNavbar') navbarElement: ElementRef;

  constructor(private neuronService: NeuronService) {}

  ngAfterViewInit() {
    NeuronService.navbarElement = this.navbarElement;
  }
}
