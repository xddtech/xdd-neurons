/// <reference path="../../../typings/_reference-three.d.ts" />
/// <reference path="../../../typings/_reference-jquery.d.ts" />

import {WanderService} from '../../services/wander-service';

export class GearShow {

   static appScene: THREE.Scene;
   static appRender: THREE.WebGLRenderer;
   static appCamera: THREE.PerspectiveCamera;
   static wanderService: WanderService;
   static showClock = new THREE.Clock();
   static gearController: THREE.GearVRController;

   camBox: THREE.Object3D;
   static room: THREE.Mesh;

   constructor(wanderService: WanderService) {
       GearShow.wanderService = wanderService;
   }

   create(showElement: Element): void {
      var appScene = new THREE.Scene();
      GearShow.appScene = appScene;

      this.addCameraAndControls();

      /*
      var appRender = new THREE.WebGLRenderer({ antialias: true });
      GearShow.appRender = appRender;
      appRender.setClearColor(new THREE.Color(0xEE0000));
      GearShow.onWindowResize();
      showElement.appendChild(appRender.domElement);
      */

      var appRender = new THREE.WebGLRenderer( { antialias: true } );
      GearShow.appRender = appRender;
      appRender.setPixelRatio( window.devicePixelRatio );
      //renderer.setSize( window.innerWidth, window.innerHeight );
      GearShow.onWindowResize();
      appRender.vr.enabled = true;
      showElement.appendChild( appRender.domElement );
      showElement.appendChild( WEBVR.createButton( appRender ) );
  
      window.addEventListener("resize", GearShow.onWindowResize);

      this.addShowObjects();

      var info = document.createElement( 'div' );
      info.style.position = 'absolute';
      info.style.top = '50px';
      info.style.width = '100%';
      info.style.textAlign = 'center';
      info.innerHTML = '<a href="http://threejs.org" target="_blank" rel="noopener">three.js - gear vr</a>';
      showElement.appendChild( info );

      GearShow.animate();
   }

   static onWindowResize() {
      var navbarHeight = GearShow.wanderService.getNavbarHeight();
      var height = window.innerHeight - navbarHeight;
      GearShow.appRender.setSize(window.innerWidth, height);
   }

   addCameraAndControls(): void {
      var fov = 70;
      var aspect = this.getCameraAspect();
      var near = 0.1;
      var far = 10;
      var appCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      GearShow.appCamera = appCamera;
      /*
      appCamera.position.x = 5;
      appCamera.position.y = 5;
      appCamera.position.z = 5;

      var lookAt = new THREE.Vector3(0, 0, 0);
      appCamera.lookAt(lookAt);
      */

      this.camBox = new THREE.Object3D();
      this.camBox.position.y = 1.8;
      this.camBox.add( GearShow.appCamera );
      GearShow.appScene.add( this.camBox );

      var controller = new THREE.GearVRController();
      GearShow.gearController = controller;
      this.camBox.position.y = 1.8;
      controller.setHand( 'right' );
      this.camBox.add( controller );
   }

  getCameraAspect(): number {
      var navbarHeight =  GearShow.wanderService.getNavbarHeight();
      var height = window.innerHeight - navbarHeight;
      return window.innerWidth / height;
  }

  addShowObjects(): void {
      var axisHelper = new THREE.AxisHelper(200);
      GearShow.appScene.add(axisHelper);

      var room = new THREE.Mesh(
          new THREE.BoxGeometry( 6, 6, 6, 8, 8, 8 ),
          new THREE.MeshBasicMaterial( { color: 0x404040, wireframe: true } )
      );
      GearShow.room = room;
      room.position.y = 3;
      GearShow.appScene.add( room );
      GearShow.appScene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );
      var light = new THREE.DirectionalLight( 0xffffff );
      light.position.set( 1, 1, 1 ).normalize();
      GearShow.appScene.add( light );

      var geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
      for ( var i = 0; i < 200; i ++ ) {
        var object = new THREE.Mesh(
          geometry,
          new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } )
        );
        object.position.x = Math.random() * 4 - 2;
        object.position.y = Math.random() * 4 - 2;
        object.position.z = Math.random() * 4 - 2;
        object.rotation.x = Math.random() * 2 * Math.PI;
        object.rotation.y = Math.random() * 2 * Math.PI;
        object.rotation.z = Math.random() * 2 * Math.PI;
        object.scale.x = Math.random() + 0.5;
        object.scale.y = Math.random() + 0.5;
        object.scale.z = Math.random() + 0.5;
        object.userData.velocity = new THREE.Vector3();
        object.userData.velocity.x = Math.random() * 0.01 - 0.005;
        object.userData.velocity.y = Math.random() * 0.01 - 0.005;
        object.userData.velocity.z = Math.random() * 0.01 - 0.005;
        room.add( object );
      }
  }

  static animate() {
      requestAnimationFrame( GearShow.animate );
  
      var deltaTime = GearShow.showClock.getDelta(),
          elapsedTime = GearShow.showClock.getElapsedTime() * 10;

      GearShow.gearController.update();

      var room = GearShow.room;
      for ( var i = 0; i < room.children.length; i ++ ) {
         var cube = room.children[ i ];
         if ( cube.geometry instanceof THREE.BoxGeometry === false ) continue;
         if ( cube.position.x < - 3 || cube.position.x > 3 ) {
            cube.position.x = THREE.Math.clamp( cube.position.x, - 3, 3 );
            cube.userData.velocity.x = - cube.userData.velocity.x;
         }
         if ( cube.position.y < - 3 || cube.position.y > 3 ) {
            cube.position.y = THREE.Math.clamp( cube.position.y, - 3, 3 );
            cube.userData.velocity.y = - cube.userData.velocity.y;
         }
         if ( cube.position.z < - 3 || cube.position.z > 3 ) {
            cube.position.z = THREE.Math.clamp( cube.position.z, - 3, 3 );
            cube.userData.velocity.z = - cube.userData.velocity.z;
         }
         cube.rotation.x += 0.01 * deltaTime;
         cube.rotation.z += 0.005;
         //cube.position.x += 0.005;
      }
  
      if (GearShow.appRender != null) {
          try {
              GearShow.appRender.render(GearShow.appScene, GearShow.appCamera);
          } catch(error) {
              console.error("GearShow render error " + error);
          }
      } else {
          console.error("GearShow appRender is null");
      }
  }
}