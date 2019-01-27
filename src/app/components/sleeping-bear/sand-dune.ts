/// <reference path="../../../typings/_reference-three.d.ts" />
/// <reference path="../../../typings/_reference-jquery.d.ts" />

import {WanderService} from '../../services/wander-service';
import {SleepingBearShow} from './sleeping-bear-show';
import {AppSbParams} from './appsb-params';

declare var $: JQueryStatic;

export class SandDune {

  duneWidth = AppSbParams.duneWidth;
  duneLength = AppSbParams.duneLength;
  widthSegments = AppSbParams.duneWidthSegments;
  lengthSegments = AppSbParams.duneLengthSegments;
  duneGeometry: THREE.PlaneGeometry;
  static sandDuneCenterLine: THREE.Vector3[] = new Array();
  static sandDuneCenterNormal: THREE.Vector3[] = new Array();

  constructor(private wanderService: WanderService) {
  }

  create(appScene: THREE.Scene) : void {
    this.duneGeometry = new THREE.PlaneGeometry(this.duneWidth, this.duneLength, 
      this.widthSegments, this.lengthSegments);
    
    //this.createCurve();
    this.createSlope();
    this.createCurveLater();
    this.createRoughness();
    this.extractMiddleLine();

    this.duneGeometry.normalsNeedUpdate = true;
    this.duneGeometry.verticesNeedUpdate = true;
    this.duneGeometry.computeFaceNormals();
    this.duneGeometry.computeVertexNormals();

    /*
    var meshParams = {
      wireframe: true,
      overdraw: 1,
      color: 0x00ffff
    };
    var duneMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111} );
    var duneMesh = THREE.SceneUtils.createMultiMaterialObject(this.duneGeometry,
       [new THREE.MeshBasicMaterial(<THREE.MeshBasicMaterialParameters>meshParams),
                duneMaterial
          ]);
    */
    
    var loader = new THREE.TextureLoader();
    var texture = loader.load("assets/textures/sand.png");
    texture.wrapS = THREE.MirroredRepeatWrapping;
    texture.wrapT = THREE.MirroredRepeatWrapping;
    texture.repeat.set(8, 2);
    texture.flipY = false;
    //texture.anisotropy = 16;
    //var sandMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: texture } );
    var sandParam = {
      color: 0xaaaaaa,
      shininess: 100,
      specular: 0xffffff, 
      map: texture
    };
    var sandMaterial = new THREE.MeshPhongMaterial(sandParam);

    //var sandMaterial = new THREE.MeshPhongMaterial( {map: texture } );
    //sandMaterial.opacity = 0.8;
    //sandMaterial.transparent = true;
    var duneMesh = THREE.SceneUtils.createMultiMaterialObject(this.duneGeometry,
       [sandMaterial]);


    //duneMesh.rotation.x = 0;
    duneMesh.position.y = this.duneLength / 2;
    appScene.add(duneMesh);
    
    try {
      this.createTexts(appScene);
    } catch(error) {
      console.error("sand-dune.ts: createTexts-" + error);
    }
  }

  createCurve(): void {
    var depthTop = 20;
    var depthBottom = 10;
    var xcenter = 0;
    var zreduce = 0.5;

    var dLength = this.duneLength / this.lengthSegments;
    for (var ih = 0; ih <= this.lengthSegments; ih++) {
      var y0 = this.duneLength / 2;
      var dy = y0 - ih * dLength;
      var yrate = 1 - ih / this.lengthSegments;
      var depth = depthTop * yrate + (1 - yrate) * depthBottom;
      var depth2 = depth * depth;
      for (var iw = 0; iw <= this.widthSegments; iw++) {
        var ivertex = iw + ih * (this.widthSegments + 1);
        var vert = this.duneGeometry.vertices[ivertex];
        var dx = vert.x - xcenter;
        var dx2 = dx * dx; 
        var dz = 0;
        if (dx2 <= depth2) {
          dz = Math.sqrt(depth2 - dx2);
          var zf = (1 - dx2 / depth2) * zreduce;
          dz = zf * dz;
          vert.z = vert.z - dz;
        }
      }
    }
  }

  createCurveLater(): void {
    var depthTop = 50;
    var depthBottom = 30;
    var xcenter = 0;
    var zreduce = 0.5;

    this.duneGeometry.computeFaceNormals();
    //this.duneGeometry.computeVertexNormals();

    var dLength = this.duneLength / this.lengthSegments;
    var iface = 0;
    for (var ih = 0; ih <= this.lengthSegments; ih++) {
      var yLen = ih * dLength;
      var yrate = 1 - ih / this.lengthSegments;
      var depth = depthTop * yrate + (1 - yrate) * depthBottom;
      var depth2 = depth * depth;

      for (var iw = 0; iw <= this.widthSegments; iw++) {
        var ivertex = iw + ih * (this.widthSegments + 1);
        var vert = this.duneGeometry.vertices[ivertex];
        var dx = vert.x - xcenter;
        var dx2 = dx * dx; 
        var dz = 0;

        var face = this.duneGeometry.faces[iface];
        var normal = face.normal;

        if (dx2 <= depth2) {
          var dn = Math.sqrt(depth2 - dx2);
          var zf = (1 - dx2 / depth2) * zreduce;
          dn = zf * dn;
          var ny = - normal.y * dn;
          var nz = -normal.z * dn;
          vert.z = vert.z + nz;
          vert.y = vert.y + ny;
        }
        // add ramdom
        var randomFactor = 1;
        var ry = randomFactor * Math.random();
        vert.y = vert.y + ry;
        
        if (iw < this.widthSegments) {
          iface = iface + 1;
        }
      }
    }
  }

  createSlope(): void {
    var length = this.duneLength;
    var sections = [];
    var s0 = {
      start: 0,
      end: 10,
      slope1: 40 * Math.PI / 180,
      slope2: 60 * Math.PI / 180
    }
    var s1 = {
      start: 10,
      end: 50,
      slope1: 60 * Math.PI / 180,
      slope2: 60 * Math.PI / 180
    }
    var s2 = {
      start: 50,
      end: 70,
      slope1: 60 * Math.PI / 180,
      slope2: 40 * Math.PI / 180
    }
    var s3 = {
      start: 70,
      end: 90,
      slope1: 40 * Math.PI / 180,
      slope2: 20 * Math.PI / 180
    }
    var s4 = {
      start: 90,
      end: 95,
      slope1: 20 * Math.PI / 180,
      slope2: 10 * Math.PI / 180
    }
    var s5 = {
      start: 90,
      end: this.duneLength,
      slope1: 10 * Math.PI / 180,
      slope2: 5 * Math.PI / 180
    }
    sections.push(s0);
    sections.push(s1);
    sections.push(s2);
    sections.push(s3);
    sections.push(s4);
    sections.push(s5);

    var dLength = this.duneLength / this.lengthSegments;
    var indexLen = this.duneGeometry.vertices.length;
    console.log("vertex len=" + indexLen);
    var zbase = 0;
    var ybase = -this.duneLength / 2;
    for (var ih = 1; ih <= this.lengthSegments; ih++) {
      var iLength = ih * dLength;
      var section = this.getSection(sections, iLength);
      for (var iw = 0; iw <= this.widthSegments; iw++) {
        var ivertex = indexLen - 1 - (iw + ih * (this.widthSegments + 1));
        var ivertexBase = indexLen - 1 - (iw + (ih - 1) * (this.widthSegments + 1));
        var vert = this.duneGeometry.vertices[ivertex];

        //if (ih === 1) {
        //  console.log("vert: " + vert.x + ", " + vert.y + ", " + vert.z);
        //}

        var vertBase = this.duneGeometry.vertices[ivertexBase];
        var slope = this.getSlope(section, iLength);

        var dz = dLength * Math.cos(slope) + zbase;
        //var dy = dLength * Math.sin(slope) + ybase;
        var dy = dLength * Math.sin(slope) + vertBase.y;
        vert.z = vert.z - dz;
        vert.y = dy;
        if (iw === this.widthSegments) {
          zbase = dz;
          ybase = dy;
        }

        /*
        var slope1 = Math.PI / 2 - slope;
        var l1 = Math.abs(vert.z * Math.tan(slope1));
        var za1 = vert.z / Math.cos(slope1);
        var zb1 = (dLength - l1) * Math.sin(slope1);
        var z1 = za1 + zb1;
        var y1 = (dLength - l1) * Math.cos(slope1);
        vert.y = vertBase.y - y1;
        //vert.z =  z1;
        */
      }
    }
  }

  createRoughness(): any {
    for (var i = 0; i < this.duneGeometry.vertices.length; i++) {
      var vert = this.duneGeometry.vertices[i];
      var rz = Math.random() - 0.5;
      vert.z = vert.z + rz * AppSbParams.duneRoughness;
    }
  }

  extractMiddleLine(): any {
    var indexLen = this.duneGeometry.vertices.length;
    for (var ih = 0; ih <= this.lengthSegments; ih++) {
      var iw = this.widthSegments / 2;
      var ivertex = indexLen - 1 - (iw + ih * (this.widthSegments + 1));
      var vert = this.duneGeometry.vertices[ivertex];
      SandDune.sandDuneCenterLine.push(vert);

      var faceLength = this.duneGeometry.faces.length;
      var iface = faceLength - (2 * iw + 2 * this.widthSegments * ih);
      var face = this.duneGeometry.faces[iface];
      //var normal = face.normal;
      //SandDune.sandDuneCenterNormal.push(normal);
    }
  }

  getSection(sections: any[], x): any {
    for(var j = 0; j < sections.length; j++) {
      var s = sections[j];
      if (x >= s.start && x < s.end) {
        return s;
      }
    }
    return sections[sections.length - 1];
  }

  getSlope(section: any, x: number): number {
    var len = section.end - section.start;
    var d = x - section.start;
    var f = Math.abs(d / len);
    var slope = section.slope1 * (1 - f) + section.slope2 * f;
    return Math.abs(slope);
  }

  createTexts(appScene: THREE.Scene): void {
    var loader = new THREE.FontLoader();
    loader.load( 'assets/fonts/helvetiker_regular.typeface.json', function ( response ) {
      var font = <any>response;
      var options = <THREE.TextGeometryParameters> {
        size: 5,
        height: 5,
        weight: "normal",
        font: font,
        bevelThickness: 2,
        bevelSize: 0.5,
        bevelSegments: 3,
        bevelEnabled: true,
        curveSegments: 12,
        steps: 1
      };
      var textGeom = new THREE.TextGeometry("Sleeping Bear", options);
      
      var meshMaterial = new THREE.MeshPhongMaterial({
              specular: 0xffffff,
              color: 0x88aaee,
              shininess: 100
           });
      var text = THREE.SceneUtils.createMultiMaterialObject(textGeom, [meshMaterial]);
      text.position.z = -60;
      text.position.y = 50;
      text.position.x = -20;
      appScene.add(text);

    } );
  }

  createTextsOld(appScene: THREE.Scene): void {
    //console.log(THREE.FontUtils.faces);
    var options = <THREE.TextGeometryParameters> {
      size: 90,
      height: 90,
      weight: "normal",
      font: new THREE.Font("helvetiker"),
      bevelThickness: 2,
      bevelSize: 0.5,
      bevelSegments: 3,
      bevelEnabled: true,
      curveSegments: 12,
      steps: 1
    };
    //var fontName = "helvetiker";
    //var fontWeight = "regular";
    //var fontLoaded;
    //var loader = new THREE.FontLoader();
		//		loader.load( 'fonts/' + fontName + '_' + fontWeight + '.typeface.json', function ( response ) {
		//			fontLoaded = response;
		//		} );
    var textGeom = new THREE.TextGeometry("Sleeping", options);

    var meshMaterial = new THREE.MeshPhongMaterial({
            specular: 0xffffff,
            color: 0xeeffff,
            shininess: 100
         });
    var text = THREE.SceneUtils.createMultiMaterialObject(textGeom, [meshMaterial]);
    text.position.z = -30;
    text.position.y = 30;
    appScene.add(text);
  }

}