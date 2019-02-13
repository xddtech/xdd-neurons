/// <reference path="../../../typings/_reference-three.d.ts" />
/// <reference path="../../../typings/_reference-jquery.d.ts" />

import {ModelCell} from './model-cell';

export class LinkLine {

  constructor(private appSense: THREE.Scene) {
  }

  add(cell1: ModelCell, cell2: ModelCell): void {
    var material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    var geometry = new THREE.Geometry();
    geometry.vertices.push(cell1.cellMesh.position);
    geometry.vertices.push(cell2.cellMesh.position);
    var line = new THREE.Line( geometry, material );
    this.appSense.add(line);
  }
}