/// <reference path="../../../typings/_reference-three.d.ts" />
/// <reference path="../../../typings/_reference-jquery.d.ts" />

import {LayerData} from './layer-data';
import {NeuronModelView} from './neuron-model-view';
import {AppGlobal} from '../../app.global';

export class ModelCell {
  static size = 0.2;
  static cellGeometry = new THREE.BoxGeometry(ModelCell.size, ModelCell.size, ModelCell.size);
  static cellMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, vertexColors: THREE.FaceColors } )
  static topColor = new THREE.Color(0, 1, 0);
  static bottomColor = new THREE.Color(0, 0, 1);
  static gray1 = new THREE.Color(0.7, 0.7, 0.7);
  static gray2 = new THREE.Color(0.8, 0.8, 0.8);

  //THREE.CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded)
  static biasGeometry = new THREE.CylinderGeometry(ModelCell.size/2, 0, ModelCell.size, 4, 1, false);

  static inputGeometry = new THREE.CylinderGeometry(ModelCell.size/2, ModelCell.size/2, ModelCell.size, 16 );
  //static inputMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
  static inputMaterial = new THREE.MeshPhongMaterial( {color: 0x00ffff, specular: 0xff0000,
    shininess: 30} );

  static outputGeometry = new THREE.SphereGeometry(ModelCell.size/2, 32, 32);
  //static outputMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
  static outputMaterial = new THREE.MeshNormalMaterial();

  static initStaticDone = false;

  static initStatic(): void {
    if (ModelCell.initStaticDone) {
      return;
    }
    ModelCell.initStaticDone = true;
    ModelCell.cellGeometry.faces[4].color = ModelCell.topColor;
    ModelCell.cellGeometry.faces[5].color = ModelCell.topColor;
    ModelCell.cellGeometry.faces[6].color = ModelCell.bottomColor;
    ModelCell.cellGeometry.faces[7].color = ModelCell.bottomColor;
    ModelCell.cellGeometry.faces[0].color = ModelCell.gray1;
    ModelCell.cellGeometry.faces[1].color = ModelCell.gray1;
    ModelCell.cellGeometry.faces[2].color = ModelCell.gray1;
    ModelCell.cellGeometry.faces[3].color = ModelCell.gray1;
    ModelCell.cellGeometry.faces[8].color = ModelCell.gray2;
    ModelCell.cellGeometry.faces[9].color = ModelCell.gray2;
    ModelCell.cellGeometry.faces[10].color = ModelCell.gray2;
    ModelCell.cellGeometry.faces[11].color = ModelCell.gray2;

    ModelCell.biasGeometry.faces[0].color = ModelCell.gray1;
    ModelCell.biasGeometry.faces[1].color = ModelCell.gray2;
    ModelCell.biasGeometry.faces[2].color = ModelCell.gray1;
    ModelCell.biasGeometry.faces[3].color = ModelCell.gray2;
    ModelCell.biasGeometry.faces[4].color = ModelCell.topColor;
    ModelCell.biasGeometry.faces[5].color = ModelCell.topColor;
    ModelCell.biasGeometry.faces[6].color = ModelCell.topColor;
    ModelCell.biasGeometry.faces[7].color = ModelCell.topColor;
  }

  static NET = 'NET';
  static BIAS = 'BIAS';
  static INPUT = 'INPUT';
  static OUTPUT = 'OUTPUT';

  appScene: THREE.Scene;
  xyz: THREE.Vector3;
  label = null;
  cellType: string;
  layerIndex: number; 
  seqIndex: number;
  
  cellMesh: THREE.Mesh;

  constructor(params: any) {
    ModelCell.initStatic();
    this.appScene = params.appScene;
    this.xyz = (params.xyz == null)? new THREE.Vector3(0, 0, 0) : params.xyz;
    this.label = params.label;
    this.cellType = params.cellType;
    this.layerIndex = params.layerIndex;
    this.seqIndex = params.seqIndex;
    this.create();
  }

  create(): void {
    var mesh;
    if (this.cellType == ModelCell.BIAS) {
      mesh = new THREE.Mesh(ModelCell.biasGeometry, ModelCell.cellMaterial );
    } else if (this.cellType == ModelCell.INPUT) {
      mesh = new THREE.Mesh(ModelCell.inputGeometry, ModelCell.inputMaterial );
    } else if (this.cellType == ModelCell.OUTPUT) {
      mesh = new THREE.Mesh(ModelCell.outputGeometry, ModelCell.outputMaterial );
    } else {
      mesh = new THREE.Mesh(ModelCell.cellGeometry, ModelCell.cellMaterial );
    }
    mesh.matrixAutoUpdate = false;
    mesh.position.x = this.xyz.x;
    mesh.position.y = this.xyz.y;
    mesh.position.z = this.xyz.z;
    this.cellMesh = mesh;
    mesh.updateMatrix();
    this.appScene.add(mesh);

    if (this.cellType == ModelCell.INPUT) {
      var from = this.xyz.clone();
      from.setY(from.y - 0.3);
      var direction = this.xyz.clone().sub(from);
      var length = direction.length() - ModelCell.size/2;
      var headLength = 0.4 * length;
      var headWidth = 0.8 * headLength;
      var arrowHelper = new THREE.ArrowHelper(direction.normalize(), from, length, 0xff00ff, headLength, headWidth);
      this.appScene.add( arrowHelper );
    }

    if (this.label != null) {
      this.createCellLabel();
    }
  }

  createCellLabel(): void {
    var lsize = 0.1;
    var lheight = 0.025;
    var dx = 0;
    var dy = 0;
    if (this.cellType == ModelCell.INPUT) {
      dx = -0.05;
      dy = -ModelCell.size - 0.3;
    } else if (this.cellType == ModelCell.OUTPUT) {
      dx = 0.05;
      dy = ModelCell.size + 0.1;
    }
    var param = {
      font: AppGlobal.labelFont,
      size: lsize,
      height: lheight
    };
    var textGeo = new THREE.TextGeometry(this.label, <THREE.TextGeometryParameters>param);
    var material = new THREE.MeshPhongMaterial({ color: 0x000000, flatShading: true });
    textGeo.computeBoundingBox();
    textGeo.computeVertexNormals();
    var mesh = new THREE.Mesh(textGeo, material);
    mesh.position.x = this.xyz.x + dx;
    mesh.position.y = this.xyz.y + dy;
    mesh.position.z = this.xyz.z;
    this.appScene.add(mesh);
  }

  createLink(targetCell: ModelCell, layers: LayerData[]): void {
    var thisLayer = layers[this.layerIndex];
    var toLayer = layers[targetCell.layerIndex];
    var weight: number;
    if (this.cellType == ModelCell.BIAS) {
      weight = thisLayer.b[targetCell.seqIndex];
    } else {
      weight = thisLayer.W[targetCell.seqIndex];
    }

    var params = this.getLinkSizeColor(weight);

    var from = this.cellMesh.position.clone();
    from.setY(this.cellMesh.position.y + ModelCell.size/2);
    var to = targetCell.cellMesh.position.clone();
    to.setY(targetCell.cellMesh.position.y - ModelCell.size/2);
    /*
    var material = new THREE.LineBasicMaterial( params );
    var geometry = new THREE.Geometry();
    geometry.vertices.push(from);
    geometry.vertices.push(to);
    var line = new THREE.Line( geometry, material );
    this.appSense.add(line);
    */

    var lineGeom = new THREE.LineGeometry();
    var positions = [];
    var colors = [];
    positions.push(from.x, from.y, from.z);
    positions.push(to.x, to.y, to.z);
    colors.push(params.rc, params.gc, params.bc);
    colors.push(params.rc, params.gc, params.bc);
    lineGeom.setPositions( positions );
    lineGeom.setColors(colors);
    var lineMat = new THREE.LineMaterial( {
      color: 0xffffff,
      linewidth: params.linewidth, // in pixels
      vertexColors: THREE.VertexColors,
      //resolution:  // need
      dashed: false
    } );
    lineMat.resolution.set( window.innerWidth, window.innerHeight ); 
    var line2 = new THREE.Line2( lineGeom, lineMat );
    line2.computeLineDistances();
    line2.scale.set(1, 1, 1 );
    this.appScene.add( line2 );
  }

  getLinkSizeColor(weight: number): any {
    /*
    LineBasicMaterialParameters extends MaterialParameters {
      color?: number|string;
      linewidth?: number;
      linecap?: string;
      linejoin?: string;
    */
    var wlineWidth = 1;

    var r = 0;
    var g = 0;
    var b = 0;
    if (weight > 0) {
      r = 255 * weight;
      if (r > 255) {
        r = 255;
      }
    } else {
      b = 255 * (-weight);
      if (b > 255) {
        b = 255;
      }
    }
    r = Math.floor(r);
    g = Math.floor(g);
    b = Math.floor(b);

    wlineWidth = Math.abs(weight) / 1.0;
    if (wlineWidth < 1) {
      //wlineWidth = 1;
      wlineWidth = wlineWidth + 0.2;
    }

    return {
      rc: r,
      gc: g,
      bc: b,
      linewidth: wlineWidth
    };
  } 
}