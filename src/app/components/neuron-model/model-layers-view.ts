
/// <reference path="../../../typings/_reference-three.d.ts" />
/// <reference path="../../../typings/_reference-jquery.d.ts" />

import {NeuronService} from '../../services/neuron-service';
import {ModelCell} from './model-cell';
import {ModelData} from './model-data';
import {LayerData} from './layer-data';

export class ModelLayersView {

  constructor(private neuronService: NeuronService, private appSense: THREE.Scene, private modelData: ModelData) {
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
      var cell = new ModelCell(this.appSense, xyz, ModelCell.OUTPUT, 0, i);
      cellList.push(cell);
    }
    return cellList;
  }

  createInputLayer(layer0: LayerData, ypos: number): ModelCell[] {
    var nin0 = layer0.conf.layer.nin;
    var cellList: ModelCell[] = new Array();
    for (var i = 0; i < nin0; i++) {
      var xyz = new THREE.Vector3(i , ypos - 0.5, 0);
      var cell = new ModelCell(this.appSense, xyz, ModelCell.INPUT, 0, i);
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
      var cell = new ModelCell(this.appSense, xyz, type, layerIndex, i);
      cellList.push(cell);
    }
    if (layer.b != null && layer.b.length > 0) {
      var xyz = new THREE.Vector3(-1, ypos, 0);
      var cell = new ModelCell(this.appSense, xyz, ModelCell.BIAS, layerIndex);
      cellList.push(cell);
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

  create1(): void {
    var size = 10;
    var geometry = new THREE.BoxGeometry( size, size, size );
    //for ( var i = 0; i < geometry.faces.length; i ++ ) {
    //    geometry.faces[ i ].color.setHex( Math.random() * 0xffffff );
    //}
    
    var material = new THREE.MeshBasicMaterial( { color: 0xffffff, vertexColors: THREE.FaceColors } )
    //var material = new THREE.MeshPhongMaterial( { color: 0xbbbbbb, flatShading: true } );

    var red = new THREE.Color(1, 0, 0);
    var green = new THREE.Color(0, 1, 0);
    var blue = new THREE.Color(0, 0, 1);
    var gray1 = new THREE.Color(0.7, 0.7, 0.7);
    var gray2 = new THREE.Color(0.8, 0.8, 0.8);
    var colors = [red, green, blue];
    
    // left 0, 1, right 2, 3, top 4, 5, buttom 6, 7, front 8, 9, back 10, 11
    geometry.faces[4].color = green;
    geometry.faces[5].color = green;
    geometry.faces[6].color = blue;
    geometry.faces[7].color = blue;
    geometry.faces[0].color = gray1;
    geometry.faces[1].color = gray1;
    geometry.faces[2].color = gray1;
    geometry.faces[3].color = gray1;
    geometry.faces[8].color = gray2;
    geometry.faces[9].color = gray2;
    geometry.faces[10].color = gray2;
    geometry.faces[11].color = gray2;

    var mesh = new THREE.Mesh( geometry, material );
    mesh.matrixAutoUpdate = false;
    this.appSense.add(mesh);
  }
}