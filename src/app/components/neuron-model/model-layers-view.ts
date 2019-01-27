
/// <reference path="../../../typings/_reference-three.d.ts" />
/// <reference path="../../../typings/_reference-jquery.d.ts" />

import {NeuronService} from '../../services/neuron-service';
import {ModelCell} from './model-cell';

export class ModelLayersView {

  constructor(private neuronService: NeuronService, private appSense: THREE.Scene) {
     this.create();
  }

  create(): void {
     new ModelCell(this.appSense);
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