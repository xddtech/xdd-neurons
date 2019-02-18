
/// <reference path="../../../typings/_reference-three.d.ts" />
/// <reference path="../../../typings/_reference-jquery.d.ts" />

import {NeuronService} from '../../services/neuron-service';
import {ModelCell} from './model-cell';
import {ModelData} from './model-data';
import {LayerData} from './layer-data';

export class ModelLayersView {
  static SQUARE = 'SQUARE';
  static ROW_FILL = 'ROW_FILL';

  cellGap = 1;
  maxRowCells = 20;
  cellLayout = ModelLayersView.ROW_FILL;
  //cellLayout = ModelLayersView.SQUARE;

  constructor(private neuronService: NeuronService, private appScene: THREE.Scene, private modelData: ModelData) {
     this.create();
  }

  create(): void {
     var layers = this.modelData.layers;
     if (layers == null || layers.length == 0) {
       console.warn('nuerons layers are empty');
       return;
     }
     var ypos = 0;
     var layerIndex: number;
     var length = layers.length;
     var prevLayer: ModelCell[];
     for (layerIndex = 0; layerIndex < length; layerIndex++) {
       var currentLayer = this.createLayer(layerIndex, layers[layerIndex], ypos);
       ypos = ypos + this.cellGap;
       if (prevLayer != null) {
         this.linkLayerCells(prevLayer, currentLayer);
       }
       prevLayer = currentLayer;
     }
     
     var currentLayer = this.createOutputLayer(length-1, layers[length-1], ypos);
     this.linkLayerCells(prevLayer, currentLayer);
  }

  createOutputLayer(layerIndex: number, layer: LayerData, ypos: number): ModelCell[] {
    var nout = layer.conf.layer.nout;
    var type = ModelCell.OUTPUT;
    var activation = layer.conf.layer.activationFn['@class'];
    return this.createGenericLayer(layerIndex, layer, ypos, nout, type, true, activation);
  }

  createLayer(layerIndex: number, layer: LayerData, ypos: number): ModelCell[] {
    var nin = layer.conf.layer.nin;
    var type = layerIndex == 0? ModelCell.INPUT : ModelCell.NET;
    var activation = layer.conf.layer.activationFn['@class'];
    return this.createGenericLayer(layerIndex, layer, ypos, nin, type, false, activation);
  }

  createGenericLayer(layerIndex: number, layer: LayerData, ypos: number, cnum: number, type: any,
      isOutput: boolean, activation: string): ModelCell[] {
    //var nin = layer.conf.layer.nin;
    var maxXRowCells = this.maxRowCells;
    if (this.cellLayout == ModelLayersView.SQUARE) {
      maxXRowCells = Math.round(Math.sqrt(cnum));
    }
    var maxZRowCells = Math.ceil(cnum / maxXRowCells);

    var cellList: ModelCell[] = new Array();
    var xCounter = 0;
    var xpos = 0;
    var zpos = 0;
    for (var i = 0; i < cnum; i++) {
      if (xCounter >= maxXRowCells) {
        xCounter = 0;
        zpos -= this.cellGap;
        xpos = 0;
      }
      xCounter++;

      var xyz = new THREE.Vector3(xpos , ypos, zpos);
      //var type = layerIndex == 0? ModelCell.INPUT : ModelCell.NET;
      var label = null;
      if (type === ModelCell.INPUT || type === ModelCell.OUTPUT) {
        label = '' + i;
      }
      var cell = new ModelCell({
        appScene: this.appScene, 
        xyz: xyz, 
        cellType: type, 
        layerIndex: layerIndex, 
        seqIndex: i,
        label: label,
        activation: activation
      });
      cellList.push(cell);
      cell.label = "" + i;

      xpos += this.cellGap;
    }
    // output has no bias cell
    if (isOutput) {
      return cellList;
    }
    var zMiddle = -this.cellGap * (Math.ceil(maxZRowCells / 2) - 1);
    if (layer.b != null && layer.b.length > 0) {
      var xyz = new THREE.Vector3(-1, ypos, zMiddle);
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