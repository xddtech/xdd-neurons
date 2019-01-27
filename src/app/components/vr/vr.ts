import {Component, ViewChild, ElementRef, AfterViewInit, OnDestroy} from '@angular/core';

import {WanderService} from '../../services/wander-service';
import {GearShow} from './gear-show';
import {CubeShow} from './cube-show';

declare var $: JQueryStatic;

const vrShowElemntId = "vr-show";
function getShowElement(): Element {
  return document.getElementById(vrShowElemntId);
}

@Component({
  selector: 'vr-page',
  templateUrl: 'vr.html',
  styleUrls: ['./vr.css'],
  providers: [WanderService]
})
export default class VRComponent implements AfterViewInit, OnDestroy {


   constructor(private wanderService: WanderService) {
   }

   ngAfterViewInit() {
      // hide scrollbar
      $("body").css("overflow", "hidden");
      if (getShowElement() != null) {
         console.log("VRComponent get showElement inside ngAfterViewInit");
      }
      //this.initGearShow();
      this.initCubeShow();
   }

   ngOnDestroy() {
      // show scrollbar for other routes
      $("body").css("overflow", "auto");
   }

   private initCubeShow(): void {
    this.showElementReady().then( () => {
       if (CubeShow.appRender == null) {
          var cubeShow = new CubeShow(this.wanderService);
          cubeShow.create(getShowElement());
       } else {
          getShowElement().appendChild(CubeShow.appRender.domElement);
          console.log("load the existing cube show renderer");
       }
    } ).catch(
       (error) => {
          console.error("failed to init cube show: " + error);
       }
    );
  }

   private initGearShow(): void {
      this.showElementReady().then( () => {
         if (GearShow.appRender == null) {
            var gearShow = new GearShow(this.wanderService);
            gearShow.create(getShowElement());
         } else {
            getShowElement().appendChild(GearShow.appRender.domElement);
            console.log("load the existing show renderer");
         }
      } ).catch(
         (error) => {
            console.error("failed to init gear show: " + error);
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