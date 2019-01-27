/// <reference path="../../../typings/_reference-three.d.ts" />
/// <reference path="../../../typings/_reference-jquery.d.ts" />

import {WanderService} from '../../services/wander-service';
import {SleepingBearShow} from './sleeping-bear-show';
import {AppSbParams} from './appsb-params';

declare var $: JQueryStatic;

export class LakeMichigan {

  beachGeometry: THREE.PlaneGeometry;
  waterGeometry: THREE.PlaneGeometry;

  constructor(private wanderService: WanderService) {
  }

  create(appScene: THREE.Scene) : void {
    this.createBeach(appScene);
    this.createDeepWater(appScene);
  }

  createBeach(appScene: THREE.Scene) : void {
    //var width = 100;
    //var length = 100;
    //var widthSegments = 50;
    //var lengthSegments = 50;
    this.beachGeometry = new THREE.PlaneGeometry(AppSbParams.beachWidth, AppSbParams.beachLength, 
      AppSbParams.beachWidthSegments, AppSbParams.beachLengthSegments);
    
    var xmiddle = AppSbParams.beachWidth / 2;
    var r = 20;
    var y0: number;
    var ym = -AppSbParams.beachLength / 2;
    var dyLength = AppSbParams.beachLength / AppSbParams.beachLengthSegments;
    var ymNext = ym + dyLength;
    for ( var i = 0, l = this.beachGeometry.vertices.length; i < l; i ++ ) {
      var xyz = this.beachGeometry.vertices[i];
      if (i === 0) {
        y0 = xyz.y;
      }
      var fy = 1 - (xyz.y - y0)/(ym - y0);
      /*
      if (Math.abs(xyz.x) < r) {
        var d = r - Math.sqrt(r*r - xyz.x * xyz.x);
        var f = 1 + 2*d/r;
        xyz.y = xyz.y - fy* d/f;
      } else {
        xyz.y = xyz.y - fy* r/3;
      }
      */
      xyz.z = xyz.z + fy * AppSbParams.beachHeight;

      if (xyz.y < ymNext) {
        var ry = (Math.random() - 0.5) * 2;
        xyz.y = xyz.y + ry;
      }
		}

    var loader = new THREE.TextureLoader();
    var texture = loader.load("assets/textures/beach-1.png");
    texture.wrapS = THREE.MirroredRepeatWrapping;
    texture.wrapT = THREE.MirroredRepeatWrapping;
    texture.repeat.set(8, 1);
    texture.flipY = false;
    //texture.anisotropy = 16;
    //var lakeMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: texture } );
    var beachParam = {
      //color: 0xaaaaaa,
      //shininess: 80,
      //specular: 0xffffff, 
      map: texture
    };
    var beachMaterial = new THREE.MeshPhongMaterial(beachParam);
    beachMaterial.opacity = 0.8;
    beachMaterial.transparent = true;
    //var mat = new THREE.MeshPhongMaterial();
    //mat.map = texture;

    var meshParams = {
      wireframe: true,
      overdraw: 1,
      color: 0x00ffff
    };
    //var beachMesh1 = THREE.SceneUtils.createMultiMaterialObject(this.lakeGeometry,
    //   [new THREE.MeshBasicMaterial(<THREE.MeshBasicMaterialParameters>meshParams),
    //            lakeMaterial
    //      ]);
    var beachMesh = THREE.SceneUtils.createMultiMaterialObject(this.beachGeometry,
       [beachMaterial]);
    
    beachMesh.rotation.x = -0.5 * Math.PI;
    beachMesh.position.z = AppSbParams.beachLength / 2 - AppSbParams.beachShift;
    appScene.add(beachMesh);
  }

  createDeepWater(appScene: THREE.Scene) : void {
    var width = AppSbParams.waterWidth;
    var length = AppSbParams.waterLength;
    var widthSegments = AppSbParams.waterWidthSegments;
    var lengthSegments = AppSbParams.waterLengthSegments;
    this.waterGeometry = new THREE.PlaneGeometry(width, length, widthSegments, lengthSegments);
    var waterGeometry = this.waterGeometry;

    var y0;
    for ( var i = 0, l = waterGeometry.vertices.length; i < l; i ++ ) {
      var xyz = waterGeometry.vertices[i];
      if (i === 0) {
        y0 = xyz.y;
        //console.info("createDeepWater-y0=" + y0);
      }
      if (xyz.y === y0) {
        var d = (0.5 - Math.random()) * 4;
        xyz.y = xyz.y + d;
      }
		}
    
    var loader = new THREE.TextureLoader();
    var texture = loader.load("assets/textures/lake-water-1.png");
    texture.wrapS = THREE.MirroredRepeatWrapping;
    texture.wrapT = THREE.MirroredRepeatWrapping;
    texture.repeat.set(4, 1);
    texture.flipY = false;
   
    var waterParam = {
      //color: 0xeeeeee,
      shininess: 1,
      specular: 0xffffff, 
      map: texture
    };
    var waterMaterial = new THREE.MeshPhongMaterial( waterParam );
    var waterMesh = new THREE.Mesh(waterGeometry, waterMaterial );
    
    waterMesh.rotation.x = -0.5 * Math.PI;
    waterMesh.position.z = length / 2 + AppSbParams.beachLength 
                           - 5 - AppSbParams.beachShift;
    waterMesh.position.y = -0.1;
    appScene.add(waterMesh);
  }

  animate(deltaTime: number, elapsedTime: number): void {
    /*
    for ( var i = 0, l = this.waterGeometry.vertices.length; i < l; i ++ ) {
      this.waterGeometry.vertices[ i ].z = 0.1 * Math.sin( i / 5 + (elapsedTime + i ) / 7 );
      this.waterGeometry.vertices[ i ].y += 0.06 * Math.sin( i / 5 + (elapsedTime + i ) / 7 );
    }
    */
    
    var dWaterLen = AppSbParams.waterLength / AppSbParams.waterLengthSegments;
    for (var kh = 0; kh <= AppSbParams.waterLengthSegments; kh++) {
      var waterLen = dWaterLen * kh;
      var fw = waterLen / AppSbParams.waterLengthSegments;
      for (var kw = 0; kw < AppSbParams.waterWidthSegments; kw++) {
        var kvetex = kw + kh * (AppSbParams.waterLengthSegments + 1);
        var vetex = this.waterGeometry.vertices[ kvetex ];
        vetex.z = fw * 0.1 * Math.sin(kvetex / 15 +  elapsedTime / 7 );
        vetex.y += fw * 0.06 * Math.sin(kvetex / 15 + elapsedTime / 7 );        
      }
    }
    this.waterGeometry.verticesNeedUpdate = true;

    var dBeachLen = AppSbParams.beachLength / AppSbParams.beachLengthSegments;
    var cutBeachLen = 0.60* AppSbParams.beachLength;
    for (var ih = 0; ih <= AppSbParams.beachLengthSegments; ih++) {
      var beachLen = dBeachLen * ih;
      if (beachLen > cutBeachLen) {
        for (var iw = 0; iw < AppSbParams.beachWidthSegments; iw++) {
          var ivertex = iw + ih * (AppSbParams.beachWidthSegments + 1);
          var vert = this.beachGeometry.vertices[ivertex];
          var iv = 0;
          vert.z += 0.001 * Math.sin( iv / 5 + (elapsedTime + iv ) / 7 );
          vert.y += 0.001 * Math.sin( iv / 5 + (elapsedTime + iv ) / 7 );
        }
      }
    }
    this.beachGeometry.verticesNeedUpdate = true;
  }
}