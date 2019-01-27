import {Component} from '@angular/core';
import {Observable} from "rxjs";

import {NamedDescription, NeuronService} from '../../services/neuron-service';

@Component({
  selector: 'about-page',
  providers: [NeuronService],
  templateUrl: 'about.html'
})
export default class AboutComponent {
  aboutDescription: string;
  mainText: string;

  constructor(private neuronService: NeuronService) {
    this.aboutDescription = this.neuronService.getAboutDescription().text;
    this.neuronService.getMainText().subscribe(data => {
      console.info('data=' + data);
      this.mainText = data;
    });
  }
}