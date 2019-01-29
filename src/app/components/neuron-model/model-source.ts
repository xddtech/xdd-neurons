import {Component} from '@angular/core';
import {Observable} from "rxjs";

import {NeuronService} from '../../services/neuron-service';
import {ModelData} from './model-data';
import {LayerData} from './layer-data';

@Component({
  selector: 'model-source',
  providers: [NeuronService],
  templateUrl: 'model-source.html'
})
export default class ModelSourceComponent {
  modelHeader = 'Network Model';
  modelSourceText: string;
  modelData: ModelData;
  layers: LayerData[];

  constructor(private neuronService: NeuronService) {
    this.neuronService.getNetworkModel().subscribe((json: Object) => {
      this.modelData = new ModelData();
      Object.assign(this.modelData, json);
      this.modelHeader = this.modelData.name;
      this.layers = this.modelData.layers;
      this.modelSourceText = JSON.stringify(json);
    });
  }
}