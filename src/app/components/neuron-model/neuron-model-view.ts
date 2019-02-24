/// <reference path="../../../typings/_reference-three.d.ts" />
/// <reference path="../../../typings/_reference-jquery.d.ts" />

import {NeuronService} from '../../services/neuron-service';
import {ModelLayersView} from './model-layers-view';
import {ModelData} from './model-data';
import {LayerData} from './layer-data';

declare var $: JQueryStatic;

export class NeuronModelView {
  static appScene: THREE.Scene;
  static appCamera: THREE.PerspectiveCamera;
  static appRender: THREE.WebGLRenderer;
  static neuronServiceRef: NeuronService;
  static showClock = new THREE.Clock();
  //static appCamControl: THREE.FirstPersonControls;
  //static appCamControl: THREE.TrackballControls;
  static appCamControl: any;
  //static labelFont: any;

  constructor(private neuronService: NeuronService) {
    NeuronModelView.neuronServiceRef = neuronService;
  }

  create(showElement: Element): void {
    NeuronModelView.appScene = new THREE.Scene();

    this.addCameraAndControls();
    
    NeuronModelView.appRender = new THREE.WebGLRenderer({ antialias: true });
    NeuronModelView.appRender.setClearColor(new THREE.Color(0xEEEEEE));
    NeuronModelView_onWindowResize();
    showElement.appendChild(NeuronModelView.appRender.domElement);

    window.addEventListener("resize", NeuronModelView_onWindowResize);

    this.addBackground();
    this.addShowObjects();
    this.addShowLights();

    NeuronModelView_animate();
  }

  addCameraAndControls(): void {
    var fov = 30;
    var aspect = this.getCameraAspect();
    var near = 0.1;
    var far = 500;
    NeuronModelView.appCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    var camera = NeuronModelView.appCamera;
    camera.position.x = 0;
    camera.position.y = 2;
    camera.position.z = 12;

    var lookAt = new THREE.Vector3(0, 8, -1);
    camera.lookAt(lookAt);
    
    /*
    var camControls = new THREE.FirstPersonControls(camera, document);
    camControls.lookSpeed = 0; //0.4;
    camControls.movementSpeed = 20;
    camControls.noFly = false;
    camControls.lookVertical = false;
    camControls.constrainVertical = true;
    //camControls.verticalMin = 1.0;
    //camControls.verticalMax = 2.0;
    //camControls.lon = -150;
    //camControls.lat = 120;
    //NeuronModelView.appCamControl = camControls;
    */

    var trackballControls = new THREE.TrackballControls(camera);
    trackballControls.rotateSpeed = 1.0;
    trackballControls.zoomSpeed = 1.0;
    trackballControls.panSpeed = 1.0;
    trackballControls.noZoom = false;
    trackballControls.noPan = false;
    trackballControls.staticMoving = true;
    trackballControls.dynamicDampingFactor = 0.3;
    //NeuronModelView.trackballControl = trackballControls;
    trackballControls.keys = [ 65, 83, 68 ];
    trackballControls.addEventListener( 'change', NeuronModelView_render );

    NeuronModelView.appCamControl = trackballControls;
  }

  addShowObjects(): void {
    var axisHelper = new THREE.AxisHelper(100);
    //NeuronModelView.appScene.add(axisHelper);

    /*
    var geometry = new THREE.CylinderBufferGeometry( 0, 10, 30, 4, 1 );
    var material = new THREE.MeshPhongMaterial( { color: 0xbbbbbb, flatShading: true } );
    for ( var i = 0; i < 500; i ++ ) {
      var mesh = new THREE.Mesh( geometry, material );
      mesh.position.x = ( Math.random() - 0.5 ) * 1000;
      mesh.position.y = ( Math.random() - 0.5 ) * 1000;
      mesh.position.z = ( Math.random() - 0.5 ) * 1000;
      mesh.updateMatrix();
      mesh.matrixAutoUpdate = false;
      //NeuronModelView.appScene.add( mesh );
    }
    */

    this.addNeuronsModel();

    /*
    var loader = new THREE.FontLoader();
    loader.load( '/libs/fonts/helvetiker_regular.typeface.json', function ( font ) {
      var param = {
        font: <any>font,
        size: 0.2,
        height: 0.1
      };
      var textGeo = new THREE.TextGeometry( 'Hello three.js!', <THREE.TextGeometryParameters>param);
      var material = new THREE.MeshPhongMaterial( { color: 0xbb0000, flatShading: true } );
      textGeo.computeBoundingBox();
      textGeo.computeVertexNormals();
      var mesh = new THREE.Mesh( textGeo, material );
      mesh.position.x = -0;
      mesh.position.y = -0;
      mesh.position.z = -0;
      //NeuronModelView.appScene.add( mesh );
    } );
    */
  }

  addNeuronsModel(): void {
    this.neuronService.getNetworkModel().subscribe((json: Object) => {
      var modelData = new ModelData();
      Object.assign(modelData, json);
      var modelLayersView = new ModelLayersView(this.neuronService, NeuronModelView.appScene, modelData);
    });
  }

  addBackground(): void {
    /*
    var loader = new THREE.TextureLoader();
    var texture = loader.load("assets/background-1.png");
    NeuronModelView.appScene.background = texture;
    */
    NeuronModelView.appScene.background = new THREE.Color( 0xcce0ff );
		//SleepingBearShow.appScene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );
  }

  addShowLights(): void {
    NeuronModelView.appScene.add( new THREE.AmbientLight( 0xffffff ) );
    
    var light = new THREE.DirectionalLight( 0xdfebff, 1.75 );
    light.position.set( 50, 200, 100 );
    light.position.multiplyScalar( 1.3 );
    light.castShadow = false;
    NeuronModelView.appScene.add( light );
    
    var light = new THREE.DirectionalLight( 0xdfebff, 0.8 );
    //light.position.multiplyScalar( 1 );
    light.position.set(-250, 510, 1150 );
    light.castShadow = false;
    NeuronModelView.appScene.add( light );
  }

  getCameraAspect(): number {
    var navbarHeight =  this.neuronService.getNavbarHeight();
    var height = window.innerHeight - navbarHeight;
    return window.innerWidth / height;
  }
}

var NeuronModelView_animate = function() {
  requestAnimationFrame( NeuronModelView_animate );

  var deltaTime = NeuronModelView.showClock.getDelta(),
      elapsedTime = NeuronModelView.showClock.getElapsedTime() * 10;
 
  if (NeuronModelView.appRender != null) {
    try {
      NeuronModelView.appRender.render(NeuronModelView.appScene, NeuronModelView.appCamera);
      if (NeuronModelView.appCamControl instanceof THREE.FirstPersonControls) {
        NeuronModelView.appCamControl.update(deltaTime);
      } else if (NeuronModelView.appCamControl instanceof THREE.TrackballControls) {
        NeuronModelView.appCamControl.update();
      }
    } catch(error) {
      console.error("render error " + error);
    }
  } else {
    console.error("appRender is null");
  }
}

function NeuronModelView_onWindowResize() {
   var navbarHeight =  NeuronModelView.neuronServiceRef.getNavbarHeight();
   var height = window.innerHeight - navbarHeight;
   NeuronModelView.appRender.setSize(window.innerWidth, height);
}

function NeuronModelView_render() {
  NeuronModelView.appRender.render(NeuronModelView.appScene, NeuronModelView.appCamera);
}
