// /// <reference path="../../../../node_modules/@types/three/index.d.ts" />
// /// <reference path="../../../typings/three-local.d.ts" />
/// <reference path="../../../typings/_reference-three.d.ts" />
/// <reference path="../../../typings/_reference-jquery.d.ts" />

import {Component, ViewChild, ElementRef, AfterViewInit, OnDestroy} from '@angular/core';
import {WanderService} from '../../services/wander-service';
import {SleepingBearShow} from '../sleeping-bear/sleeping-bear-show';

declare var $: JQueryStatic;

const wanderLandShowElemntId = "wander-land-show";
function getShowElement(): Element {
  return document.getElementById(wanderLandShowElemntId);
}

@Component({
  selector: 'wander-land',
  templateUrl: 'wander-land.html',
  styleUrls: ['./wander-land.css'],
  providers: [WanderService]
})
export default class WanderLandComponent implements AfterViewInit, OnDestroy {
  static wanderLandRenderer: THREE.WebGLRenderer;
  static wanderServiceRef: WanderService;
  wanderLandShowElemnt: any;
  @ViewChild('selectElem') el: ElementRef;

  constructor(private wanderService: WanderService) {
    WanderLandComponent.wanderServiceRef = wanderService;
  }

  ngAfterViewInit() {
    // hide scrollbar
    $("body").css("overflow", "hidden");
    if (getShowElement() != null) {
      console.log("get showElement inside ngAfterViewInit");
    }
    //this.initSetup();
    this.initSleepingBear();
  }

  ngOnDestroy() {
    // show scrollbar for other routes
    $("body").css("overflow", "auto");
  }

  private initSleepingBear(): void {
    this.showElementReady().then( () => {
      if (SleepingBearShow.appRender == null) {
        var sleepingBearShow = new SleepingBearShow(this.wanderService);
        sleepingBearShow.create(getShowElement());
      } else {
        getShowElement().appendChild(SleepingBearShow.appRender.domElement);
        console.log("load the existing show renderer");
      }
    } ).catch(
      (error) => {
        console.error("failed to init sleeping bear: " + error);
      }
    );
  }

  private initSetup(): void {
    this.showElementReady().then( () => {
      if (WanderLandComponent.wanderLandRenderer == null) {
        WanderLandComponent.wanderLandRenderer = initWanderLandShow();
      } else {
        getShowElement().appendChild(WanderLandComponent.wanderLandRenderer.domElement);
        console.log("load the existing show renderer");
      }
    } ).catch(
      () => {
        console.error("failed to get the show element");
      }
    );
  }

  private showElementReady(): Promise<void> {
    return new Promise<void> (
      (resolve: () => void, reject: () => void ) => {
        var checkTimes = 0;
        function checkShowElement() {
          if (getShowElement() == null) {
            checkTimes++;
            if (checkTimes > 10) {
              reject();
            }
            setTimeout(checkShowElement, 200);
            console.log("checking showElement: " + checkTimes + "...");
          } else {
            console.log("showElement ready");
            resolve();
          }
        }
        checkShowElement();
      }
    );
  }
}

function resizeWindow() {
  resizeShowWindow(WanderLandComponent.wanderLandRenderer);
}

function resizeShowWindow(renderer: THREE.WebGLRenderer) {
  if (renderer == null) {
    return;
  }
  //var width = window.innerWidth;
  var width = $(document).innerWidth();

  var navbarHeight =  WanderLandComponent.wanderServiceRef.getNavbarHeight();
  var height = window.innerHeight - navbarHeight;
  console.log("width=" + width + ", height=" + height + ", navbarHeight=" + navbarHeight);

  renderer.setSize(width, height);
}

function initWanderLandShow(): THREE.WebGLRenderer {
   var scene = new THREE.Scene();
   var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000 );

   var renderer = new THREE.WebGLRenderer();
   resizeShowWindow(renderer);
   getShowElement().appendChild(renderer.domElement);
   window.addEventListener("resize", resizeWindow);

   var geometry = new THREE.BoxGeometry(1, 1, 1);
   var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
   var cube = new THREE.Mesh(geometry, material);
   scene.add( cube );

   camera.position.z = 5;

   var loops = 0;
   var animate = function () {
     if(loops < 500) {
       requestAnimationFrame( animate );
     }

     cube.rotation.x += 0.1;
     cube.rotation.y += 0.1;
     loops = loops + 1;

     renderer.render(scene, camera);
   };

   animate();
   return renderer;
}