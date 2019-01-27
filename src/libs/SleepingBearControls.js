
THREE.SleepingBearControls = function ( object, domElement ) {

	this.object = object;
	this.position0 = new THREE.Vector3(0, 0, 0 );
	this.target = new THREE.Vector3(0, 0, 0 );
	this.target0 = new THREE.Vector3(-50, 0, 0);
	this.target1 = new THREE.Vector3(0, 0, 0);
	this.targetDistance1 = 1.0;

	this.domElement = ( domElement !== undefined ) ? domElement : document;

	this.movementSpeed = 1.0;
	this.lookSpeed = 0.005;
	this.climbSpeed = 1.0;

	this.lookVertical = true;
	this.autoForward = false;
	// this.invertVertical = false;

	this.activeLook = true;

	this.heightSpeed = false;
	this.heightCoef = 1.0;
	this.heightMin = 0.0;
	this.heightMax = 1.0;

	this.constrainVertical = false;
	this.verticalMin = 0;
	this.verticalMax = Math.PI;

	this.autoSpeedFactor = 0.0;

	this.mouseX = 0;
	this.mouseY = 0;
	this.prevMouseX = 0;
	this.prevMouseY = 0;

	this.touchX = 0;
	this.touchY = 0;
	this.touchMove = false;

	this.lat = 0;
	this.lon = 0;
	this.phi = 0;
	this.theta = 0;

	this.moveForward = false;
	this.moveBackward = false;
	this.moveLeft = false;
	this.moveRight = false;
	this.freeze = false;

	this.mouseDragOn = false;

	this.viewHalfX = 0;
	this.viewHalfY = 0;

	this.SECTION_LAKE = 0;
	this.SECTION_SAND = 1;
	this.currentSection = this.SECTION_LAKE;

	this.lakeSandSwitchZ = 2;
	this.sandLakeSwitchY = 0.5;
	this.maxClimbHeight = 20;

	this.duneLookAngle = 0;
	this.duneLookAt = {
		x: 0,
		y: 0,
		z: 0
	};

	if ( this.domElement !== document ) {
		this.domElement.setAttribute( 'tabindex', -1 );
	}

	//
	this.init = function() {
	  this.position0.x = this.object.position.x;
	  this.position0.y = this.object.position.y;
	  this.position0.z = this.object.position.z;

	  this.target0 = new THREE.Vector3(-50, 0, 0);
	  this.target1 = new THREE.Vector3(0, 0, 0);
	  var cp = this.object.position;
	  var cameraV3 = new THREE.Vector3(cp.x, cp.y, cp.z);
	  //this.targetDistance1 = cameraV3.distanceTo(this.target1);
	  this.targetDistance1 = Math.abs(cp.x - this.target1.x);

	  $( "#duneClimbInfo" ).hide();
	  $( "#climbTopWelcome").hide();
	}

	this.sandDuneCenterLine = null;
	this.sandDuneCenterNormal = null;
	
	this.setSandDuneParams = function(centerLine, centerNormal) {
	  this.sandDuneCenterLine = centerLine;
	  this.sandDuneCenterNormal = centerNormal;
	}

	this.handleResize = function () {
		if ( this.domElement === document ) {
			this.viewHalfX = window.innerWidth / 2;
			this.viewHalfY = window.innerHeight / 2;
		} else {
			this.viewHalfX = this.domElement.offsetWidth / 2;
			this.viewHalfY = this.domElement.offsetHeight / 2;
		}
	};

	this.onMouseDown = function ( event ) {
		if ( this.domElement !== document ) {
			this.domElement.focus();
		}

		event.preventDefault();
		event.stopPropagation();

		if ( this.activeLook ) {
			switch ( event.button ) {
			    case 0: this.moveForward = true; break;
				case 2: this.moveBackward = true; break;
			}

		}
		this.mouseDragOn = true;
		this.prevMouseX = event.pageX;
		this.prevMouseY = event.pageY;
		//this.moveBackward = false;
		//this.moveForward = false;
		//this.moveLeft = false;
		//this.moveRight = false;
	};

	this.onMouseUp = function ( event ) {
		event.preventDefault();
		event.stopPropagation();
		if ( this.activeLook ) {
			switch ( event.button ) {
				case 0: this.moveForward = false; break;
				case 2: this.moveBackward = false; break;
			}
		}
		//this.mouseDragOn = false;
		//this.moveBackward = false;
		//this.moveForward = false;
		//this.moveLeft = false;
		//this.moveRight = false;
	};

	this.onMouseMove = function ( event ) {
		if ( this.domElement === document ) {
			this.mouseX = event.pageX - this.viewHalfX;
			this.mouseY = event.pageY - this.viewHalfY;
		} else {
			this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
			this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;
		}
		/*
		this.moveLeft = false;
		this.moveRight = false;
		this.moveForward = false;
		this.moveBackward = false;
		if(this.mouseDragOn) {
		    if (Math.abs(this.mouseX) >= Math.abs(this.mouseY)) {
                if(this.mouseX > this.prevMouseX) {
				    this.moveRight = true;
			    } else {
				    this.moveLeft = true;
			    }
		    } else {
			    if (this.mouseY < this.prevMouseY) {
				    this.moveForward = true;
			    } else {
				    this.moveBackward = true;
			    }
		    }
		}
		*/
		this.prevMouseX = event.pageX;
		this.prevMouseY = event.pageY;
	};

	this.onKeyDown = function ( event ) {

		//event.preventDefault();

		switch ( event.keyCode ) {
			case 38: /*up*/
			case 87: /*W*/ this.moveForward = true; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = true; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = true; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = true; break;

			case 82: /*R*/ this.moveUp = true; break;
			case 70: /*F*/ this.moveDown = true; break;

			case 81: /*Q*/ this.freeze = !this.freeze; break;
		}
	};

	this.onKeyUp = function ( event ) {

		switch( event.keyCode ) {
			case 38: /*up*/
			case 87: /*W*/ this.moveForward = false; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = false; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = false; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = false; break;

			case 82: /*R*/ this.moveUp = false; break;
			case 70: /*F*/ this.moveDown = false; break;
		}
	};

	this.touchStart = function(event) {
		var t = e.touches[0];
		this.touchX = t.screenX; 
		this.touchY = t.screenY;
	}

	this.touchMove = function(event) {
		this.touchMove = true;
		var t = e.touches[0];
		var tx = t.screenX; 
		var ty = t.screenY;
		var dx = tx - this.touchX;
		var dy = ty - this.touchY;
		if (dx === 0 && dy ===0) {
			this.moveLeft = false;
			this.moveRight = false;
			this.moveForward = false;
			this.moveBackward = false;
		}
		else if( Math.abs(dx) > Math.abs(dy)) {
            if(dx > 0) {
				this.moveRight = true;
			} else {
				this.moveLeft = true;
			}
		} else {
			if(dy > 0) {
				this.moveBackward = true;
			} else {
				this.moveForward = true;
			}
		}

		this.touchX = t.screenX; 
		this.touchY = t.screenY;
	}

	this.touchEnd = function(event) {
		this.touchMove = false;
		this.moveLeft = false;
		this.moveRight = false;
		this.moveForward = false;
		this.moveBackward = false;
	}

	this.update = function( delta ) {

		if ( this.freeze ) {
			return;
		}
		if (this.currentSection === this.SECTION_LAKE) {
			this.updateLakeSection(delta);
		} else if(this.currentSection === this.SECTION_SAND) {
			this.updateSandSection(delta);
		}
	}

	this.updateLakeSection = function(delta) {

		if ( this.heightSpeed ) {
			var y = THREE.Math.clamp( this.object.position.y, this.heightMin, this.heightMax );
			var heightDelta = y - this.heightMin;
			this.autoSpeedFactor = delta * ( heightDelta * this.heightCoef );
		} else {
			this.autoSpeedFactor = 0.0;
		}

		var actualMoveSpeed = delta * this.movementSpeed;

		//if ( this.moveForward || ( this.autoForward && !this.moveBackward ) ) this.object.translateZ( - ( actualMoveSpeed + this.autoSpeedFactor ) );
		//if ( this.moveBackward ) this.object.translateZ( actualMoveSpeed );
		if ( this.moveForward || ( this.autoForward && !this.moveBackward ) ||
		     this.moveLeft) {
			var mzforw =  -(actualMoveSpeed + this.autoSpeedFactor);
			var mxforw = -actualMoveSpeed;
			this.object.translateX(mxforw);
			this.object.translateZ(mzforw);
			if(this.object.position.x < 0) {
				this.object.position.x = 0;
			}

			//console.info("lake x,y,z = " + this.object.position.x + ", " + this.object.position.y +
		    //               ", " + this.object.position.z);

			if(this.object.position.z < this.lakeSandSwitchZ) {
				this.currentSection = this.SECTION_SAND;
				console.info("switch to sand section ");
				console.info("lake x,y,z = " + this.object.position.x + ", " + this.object.position.y +
						   ", " + this.object.position.z);
				this.duneLookAt.x = this.object.position.x;
				this.duneLookAt.y = this.object.position.y + 1;
				this.duneLookAt.z = this.object.position.z + 1;
				this.duneLookAngle = 0;
				$( "#duneClimbInfo" ).show(1000);
			}
		}
		if ( this.moveBackward || this.moveRight) {
			var p0Clone = this.position0.clone();
			p0Clone.sub(this.object.position);
			p0Clone.normalize();

			var mxback = actualMoveSpeed * p0Clone.x;
			var myback = actualMoveSpeed * p0Clone.y;
			var mzback = actualMoveSpeed * p0Clone.z;

			this.object.translateX(mxback);
			this.object.translateY(myback);
			this.object.translateZ(mzback);
			if(this.object.position.x > this.position0.x) {
				this.object.position.x = this.position0.x;
			}
			if(this.object.position.y < this.position0.y) {
				this.object.position.y = this.position0.y;
			}
	       	if(this.object.position.z < this.position0.z) {
				this.object.position.z = this.position0.z;
			}
		}

		//if ( this.moveLeft ) this.object.translateX( - actualMoveSpeed );
		//if ( this.moveRight ) this.object.translateX( actualMoveSpeed );

		if ( this.moveUp ) this.object.translateY( actualMoveSpeed );
		if ( this.moveDown ) this.object.translateY( - actualMoveSpeed );

		var actualLookSpeed = delta * this.lookSpeed;

		if ( !this.activeLook ) {

			actualLookSpeed = 0;

		}

		var verticalLookRatio = 1;

		if ( this.constrainVertical ) {

			verticalLookRatio = Math.PI / ( this.verticalMax - this.verticalMin );

		}

		this.lon += this.mouseX * actualLookSpeed;
		if( this.lookVertical ) this.lat -= this.mouseY * actualLookSpeed * verticalLookRatio;

		this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
		this.phi = THREE.Math.degToRad( 90 - this.lat );

		this.theta = THREE.Math.degToRad( this.lon );

		if ( this.constrainVertical ) {

			this.phi = THREE.Math.mapLinear( this.phi, 0, Math.PI, this.verticalMin, this.verticalMax );

		}

		var targetPosition = this.target,
			position = this.object.position;

		//if (this.mouseDragOn) {
		//	this.phi = THREE.Math.degToRad(90);
		//	var lookAt = this.object.getWorldDirection();
		//    targetPosition.x = lookAt.x + 10 * Math.sin( this.phi ) * Math.cos( this.theta );
		//    targetPosition.y = lookAt.y + 10 * Math.cos( this.phi );
		//    targetPosition.z = lookAt.z + 10 * Math.sin( this.phi ) * Math.sin( this.theta );
		//    this.object.lookAt( targetPosition );
		//} else 
		{
          var cp = this.object.position;
	      var cameraV3 = new THREE.Vector3(cp.x, cp.y, cp.z);
		  //var dtarget1 = cameraV3.distanceTo(this.target1);
		  var dtarget1 = Math.abs(cp.x - this.target1.x);
		  var tf = dtarget1 / this.targetDistance1;
		  var tx = tf * this.target0.x + (1 - tf) * this.target1.x;
		  var ty = tf * this.target0.y + (1 - tf) * this.target1.y;
		  var tz = tf * this.target0.z + (1 - tf) * this.target1.z;
		  var targetPos = {
		  	x: tx,
		  	y: ty,
		  	z: tx
		  };
		  this.object.lookAt( targetPos );
		}
	};

	this.updateSandSection = function(delta) {
		
		var actualMoveSpeed = delta * this.climbSpeed;
		var slope = this.getSandDuneSlope(this.object.position);

		if ( this.moveForward || ( this.autoForward && !this.moveBackward ) ) {

			var mzforw =  -(actualMoveSpeed + this.autoSpeedFactor);
			var myforw = actualMoveSpeed;
			console.info("lake x,y,z = " + this.object.position.x + ", " + this.object.position.y +
						   ", " + this.object.position.z + 
						", slope=" + slope.x + ", " + slope.y + ", " + slope.z);
			if (this.object.position.y < this.maxClimbHeight) {
			  //mzforw = -mzforw * slope.z;
			  //myforw = myforw * slope.y;
			  this.object.translateY(myforw);
			  this.object.translateZ(mzforw);
			}
			//if(this.object.position.y < 1) {
			//	this.object.position.y = 1;
			//}
			if (this.object.position.y >= this.maxClimbHeight) {
				$( "#climbTopWelcome" ).show();
			}
		}
		if ( this.moveBackward ) {
			var p0Clone = this.position0.clone();
			p0Clone.sub(this.object.position);
			p0Clone.normalize();

			slope.negate();

			var mxback = 0;
			var myback = -actualMoveSpeed;
			var mzback = actualMoveSpeed;
			//myback = myback * slope.y;
			//mzback = -mzback * slope.z;

			this.object.translateX(mxback);
			this.object.translateY(myback);
			this.object.translateZ(mzback);

			if(this.object.position.y < this.sandLakeSwitchY) {
				this.currentSection = this.SECTION_LAKE;
			    //console.info("lake x,y,z = " + this.object.position.x + ", " + this.object.position.y +
		        //           ", " + this.object.position.z);
				console.info("switch to lake section ");
				$( "#duneClimbInfo" ).hide();
				$( "#climbTopWelcome" ).hide();
			}

		}

		//if ( this.moveLeft ) this.object.translateX( - actualMoveSpeed );
		//if ( this.moveRight ) this.object.translateX( actualMoveSpeed );

		var actualLookSpeed = delta * this.lookSpeed;

		if ( !this.activeLook ) {

			actualLookSpeed = 0;

		}

		var verticalLookRatio = 1;

		if ( this.constrainVertical ) {

			verticalLookRatio = Math.PI / ( this.verticalMax - this.verticalMin );

		}

		this.lon += this.mouseX * actualLookSpeed;
		if( this.lookVertical ) this.lat -= this.mouseY * actualLookSpeed * verticalLookRatio;

		this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
		this.phi = THREE.Math.degToRad( 90 - this.lat );

		this.theta = THREE.Math.degToRad( this.lon );

		if ( this.constrainVertical ) {

			this.phi = THREE.Math.mapLinear( this.phi, 0, Math.PI, this.verticalMin, this.verticalMax );

		}

		var cp = this.object.position;
		var turnSpeed = 0.01;
		
		if (this.moveLeft || this.moveRight) {
		   var lookAt = this.object.getWorldDirection();
		   var speed = -turnSpeed;
		   if (this.moveRight) {
			   speed = turnSpeed;
		   }
		   var pi = 3.14159;
		   var pi2 = 2 * pi;
		   this.duneLookAngle += speed;
		   if (this.duneLookAngle > pi2) {
			   this.duneLookAngle -= pi2;
		   }
		   if (this.duneLookAngle < -pi2) {
			   this.duneLookAngle += pi2;
		   }

			var tx = cp.x + Math.sin(this.duneLookAngle);
			var ty = cp.y + 1;
			var tz = cp.z + Math.cos(this.duneLookAngle);
			console.log("duneLookAt " + tx + ", " + ty + ", " + tz + ", " + this.duneLookAngle);
			//this.object.lookAt( {
			//	x: tx,
			//	y: ty,
			//	z: tz
			// });

			var cos = Math.cos(this.duneLookAngle);
			var cos2 = cos*cos;
			var angf = Math.abs(Math.abs(this.duneLookAngle) - pi)/pi;
			var looky = angf - (1-angf)*0.55;
			this.duneLookAt.x = cp.x + Math.sin(this.duneLookAngle);
			this.duneLookAt.y = cp.y + looky;
			this.duneLookAt.z = cp.z - Math.cos(this.duneLookAngle);
			//this.object.lookAt(this.duneLookAt);
		} else if (this.moveForward || this.moveBackward) {
		  var tx = cp.x;
		  var ty = cp.y + 1;
		  var tz = cp.z + 1;
		  var targetPos = {
			x: tx,
			y: ty,
			z: tx
		  };
		  //this.object.lookAt( targetPos );

		  var backSpeed = turnSpeed;
		  if (this.duneLookAngle > 0 && this.duneLookAngle > backSpeed) {
			this.duneLookAngle -= backSpeed;
		  }
		  if (this.duneLookAngle < 0 && this.duneLookAngle < -backSpeed) {
			this.duneLookAngle += backSpeed;
		  }
		 
		  this.duneLookAt.x = cp.x + Math.sin(this.duneLookAngle);
		  this.duneLookAt.y = cp.y+ Math.cos(this.duneLookAngle);
		  this.duneLookAt.z = cp.z - Math.cos(this.duneLookAngle);
		  //this.object.lookAt(this.duneLookAt);
		  //var tmp = {
			// x: this.duneLookAt.x,
			 //y: this.duneLookAt.y,
			 //z: this.duneLookAt.z
		  //};
		  //console.log("tmp=" + tmp.x + ", " + tmp.y + ", " + tmp.z);
		  //console.log("tar=" + targetPos.x + ", " + targetPos.y + ", " + targetPos.z);
		  //this.object.lookAt(tmp);
		}
		this.object.lookAt(this.duneLookAt);
	}

	this.getSandDuneSlope = function(position) {
	  var lines = this.sandDuneCenterLine;
	  var len = lines.length;
	  var p1 = null;
	  var p2 = null;
	  var i = 0;
	  for (i =0; i < (len-1); i++) {
		  p1 = lines[i];
		  p2 = lines[i+1];
		  if (position.y >= p1.y && position.y <= p2.y &&
			  position.z >= p1.z && position.z <= p2.z) {
				break;
		  }
	  }
      if (p1 === null || p2 === null) {
		 return new THREE.Vector3(0, 0, -1);
	  }
	  var v = new THREE.Vector3(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z);
	  v.normalize();
	  return v;
	}


	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

	this.domElement.addEventListener( 'mousemove', bind( this, this.onMouseMove ), false );
	this.domElement.addEventListener( 'mousedown', bind( this, this.onMouseDown ), false );
	this.domElement.addEventListener( 'mouseup', bind( this, this.onMouseUp ), false );
	this.domElement.addEventListener( 'keydown', bind( this, this.onKeyDown ), false );
	this.domElement.addEventListener( 'keyup', bind( this, this.onKeyUp ), false );
	this.domElement.addEventListener('touchstart', bind(this, this.touchStart), false);
	this.domElement.addEventListener('touchmove', bind(this, this.touchMove), false);
	this.domElement.addEventListener('touchend', bind(this, this.touchEnd), false);

	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	};

	this.handleResize();

};
