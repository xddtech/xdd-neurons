/// <reference path="../../../typings/_reference-three.d.ts" />
/// <reference path="../../../typings/_reference-jquery.d.ts" />

import {Component, ViewChild, ElementRef, AfterViewInit, OnDestroy} from '@angular/core';
import {NeuronService} from '../../services/neuron-service';
import {NeuronModelView} from '../neuron-model/neuron-model-view';

declare var $: JQueryStatic;

const neuronViewDiv = "neuron-view-div";
function getNeuronViewElement(): Element {
  return document.getElementById(neuronViewDiv);
}

@Component({
  selector: 'neurons-view',
  templateUrl: 'neurons-view.html',
  styleUrls: ['./neurons-view.css'],
  providers: [NeuronService]
})
export default class NeuronViewComponent implements AfterViewInit, OnDestroy {
  static neuronViewRenderer: THREE.WebGLRenderer;
  static neuronServiceRef: NeuronService;
  @ViewChild('selectElem') el: ElementRef;

  constructor(private neuronService: NeuronService) {
    NeuronViewComponent.neuronServiceRef = neuronService;
  }

  ngAfterViewInit() {
    // hide scrollbar
    $("body").css("overflow", "hidden");
    if (getNeuronViewElement() != null) {
      console.log("get neuronViewElement inside ngAfterViewInit");
    }
    this.initNeuronModelShow();
  }

  ngOnDestroy() {
    // show scrollbar for other routes
    $("body").css("overflow", "auto");
  }

  private initNeuronModelShow(): void {
    this.showElementReady().then( () => {
      if (NeuronModelView.appRender == null) {
        var modelView = new NeuronModelView(this.neuronService);
        modelView.create(getNeuronViewElement());
      } else {
        getNeuronViewElement().appendChild(NeuronModelView.appRender.domElement);
        console.log("loaded the existing show renderer");
      }
    } ).catch(
      (error) => {
        console.error("failed to init neuron model: " + error);
      }
    );
  }

  private showElementReady(): Promise<void> {
    return new Promise<void> (
      (resolve: () => void, reject: () => void ) => {
        var checkTimes = 0;
        function checkShowElement() {
          if (getNeuronViewElement() == null) {
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

/*
function resizeWindow() {
  resizeShowWindow(NeuronViewComponent.neuronViewRenderer);
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
*/