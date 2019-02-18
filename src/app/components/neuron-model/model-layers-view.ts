
/// <reference path="../../../typings/_reference-three.d.ts" />
/// <reference path="../../../typings/_reference-jquery.d.ts" />

import {NeuronService} from '../../services/neuron-service';
import {ModelCell} from './model-cell';
import {ModelData} from './model-data';
import {LayerData} from './layer-data';

export class ModelLayersView {

  constructor(private neuronService: NeuronService, private appScene: THREE.Scene, private modelData: ModelData) {
     this.create();
  }

  create(): void {
     //new ModelCell(this.appSense);
     var layers = this.modelData.layers;
     if (layers == null || layers.length == 0) {
       console.warn('nuerons layers are empty');
       return;
     }
     var ypos = 0;
     var i: number;
     var length = layers.length;
     var prevLayer: ModelCell[];
     for (i = 0; i < length; i++) {
       //if (i == 0) {
         //create input cell
       //  prevLayer = this.createInputLayer(layers[0], ypos);
       //}
       var currentLayer = this.createLayer(i, layers[i], ypos);
       ypos = ypos + 0.5;
       if (prevLayer != null) {
         this.linkLayerCells(prevLayer, currentLayer);
       }
       prevLayer = currentLayer;
     }
     
     var currentLayer = this.createOutputLayer(layers[length-1], ypos);
     this.linkLayerCells(prevLayer, currentLayer);
  }

  createOutputLayer(layer: LayerData, ypos: number): ModelCell[] {
    var nout = layer.conf.layer.nout;
    var cellList: ModelCell[] = new Array();
    for (var i = 0; i < nout; i++) {
      var xyz = new THREE.Vector3(i , ypos, 0);
      var cell = new ModelCell({
        appScene: this.appScene, 
        xyz: xyz, 
        cellType: ModelCell.OUTPUT, 
        layerIndex: 0, 
        seqIndex: i
      });
      cellList.push(cell);
    }
    return cellList;
  }

  createLayer(layerIndex, layer: LayerData, ypos: number): ModelCell[] {
    var nin = layer.conf.layer.nin;
    var cellList: ModelCell[] = new Array(); 
    for (var i = 0; i < nin; i++) {
      var xyz = new THREE.Vector3(i , ypos, 0);
      var type = layerIndex == 0? ModelCell.INPUT : ModelCell.NET;
      var label = null;
      if (type === ModelCell.INPUT) {
        label = '' + i;
      }
      var cell = new ModelCell({
        appScene: this.appScene, 
        xyz: xyz, 
        cellType: type, 
        layerIndex: layerIndex, 
        seqIndex: i,
        label: label
      });
      cellList.push(cell);
      cell.label = "" + i;
    }
    if (layer.b != null && layer.b.length > 0) {
      var xyz = new THREE.Vector3(-1, ypos, 0);
      var cell = new ModelCell({
        appScene: this.appScene, 
        xyz: xyz, 
        cellType: ModelCell.BIAS, 
        layerIndex: layerIndex
      });
      cellList.push(cell);
      cell.label = "b";
    }
    return cellList;
  }

  linkLayerCells(prevLayer: ModelCell[], currentLayer: ModelCell[]): void {
    for (var i = 0; i < prevLayer.length; i++) {
      var c1 = prevLayer[i];
      for (var j = 0; j < currentLayer.length; j++) {
        var c2 = currentLayer[j];
        if ( c2.cellType != ModelCell.BIAS ) {
          c1.createLink(c2, this.modelData.layers);
        }
      }
    }

  }
}