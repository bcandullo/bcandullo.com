window.B.destroyer = (function (utils) {
	
	'use strict';

	var REDRAW_INT = (10 + Math.floor(20 - (window.innerWidth / 100))); // ms, higher is slower but easier on cpu
	var LETTER_DENSITY = 6; // higher = less dense, easier to draw
	var MAX_DISTANCE = 30; // maxmium explosion distance

	var bg = $('.body-bg'),
		score = 0,
		clicks = 0,
		scoreText = $('.score'),
		boom = 1,
		canvas = $('.destroyer'),
		canvasOffsetY = 320,
		ctx,
		reset = false,
		pointCollection,
		isEnabled = true, // flag for scroller module
		canvasWidth,
		canvasHeight = $('.intro').offsetHeight,
		restartButton = $('[data-js=restart]');

	// vendor-specific transforms for mousemove
	var transformStyle = (function (vendors) {
		for (var i = 0, len = vendors.length; i < len; i ++) {
			if (vendors[i] in canvas.style) {
				return vendors[i];
			}
		}
	}( ['webkitTransform', 'MozTransform', 'msTransform'] ));

    function drawCanvasText (text, callback) {

        var points = [];

        ctx.font = "400 180px Rokkitt, sans-serif";
        ctx.fillStyle = '#000';
       	ctx.fillText(text, 0, canvasOffsetY, canvasWidth);

        var imgwidth = ctx.measureText(text).width;
			imgwidth = imgwidth > canvasWidth ? canvasWidth : imgwidth;

        var imagedata = ctx.getImageData(0, 0, imgwidth, canvasHeight),
        	x, y,
        	idWidth = imagedata.width,
        	idHeight = imagedata.height,
        	idData = imagedata.data; // cached data performs slightly faster

        for (x = 0; x < idWidth; x += LETTER_DENSITY) {

            for (y = 0; y < idHeight; y += LETTER_DENSITY) {

                var index = (y * 4) * idWidth + x * 4;
                
                var r = idData[index],
                	g = idData[index + 1],
                	b = idData[index + 2],
                	a = idData[index + 3];
                
                if (r | g | b | a) {
                    var p = new Point(x + canvasWidth / 2 - imgwidth / 2,
                        					y,
											0.0, 
											LETTER_DENSITY / 2);
                        
					points.push(p);
                }
            }

        }

        if (typeof callback === 'function') {
        	callback(points);
        }

    }

    function postInit (points) {
        pointCollection = new PointCollection();
        pointCollection.points = points;
        window.setTimeout(preview, 300);
        bindEvents();
    }

    function preview () {

		var speed = 30,
			c = 0,
			max = Math.floor(Math.sqrt(window.innerWidth) * 0.5);

		boom = 1 + Math.floor(Math.random() * 6);

		window.int = window.setInterval(function() {
			if (c > max) {
				clearInterval(window.int);
				window.int = null;
				boom = 1;
			}
			pointCollection.mousePos.set(c * 70, canvasOffsetY - 30);
			c += 1;
		}, speed);

		canvas.style.display = 'block';
		
    }

	function bindEvents (skipDraw) {
		console.log('destroyer : enable events');
		window.addEventListener('resize', updateCanvasDimensions, false);
		canvas.addEventListener('mousemove', onMove, false);
		canvas.addEventListener('click', onClick, false);
		canvas.addEventListener('touchstart', onClick, false);
		restartButton.addEventListener('click', restart, false);
		(transformStyle) && canvas.addEventListener('mousemove', onBgMouseMove, false);
		isEnabled = true;
		// skip draw so we don't double-up on drawing recursion
		!skipDraw && window.setTimeout(timeout, 1);
	}

	function unbindEvents () {
		console.log('destroyer : disable events');
		canvas.removeEventListener('mousemove', onMove);
		canvas.removeEventListener('click', onClick);
		canvas.removeEventListener('touchstart', onClick);
		isEnabled = false;
	}
	
	// initial canvas sizing
	function updateCanvasDimensions () {
		canvas.setAttribute('width', window.innerWidth);
		//canvas.setAttribute('height', canvasHeight);
		canvasWidth = canvas.width;
		draw();
	}
	
	function setScore (amount) {
		score += Math.floor(Math.abs(amount) / 2);
	}

	/*
	* event callbacks
	*/

	function onClick () {
    	boom = -(Math.random() * MAX_DISTANCE) - 8; // random explosion size calculation
		window.setTimeout(function() {
			boom = 1;
			if (!restartButton.classList.contains('active')) {
				restartButton.classList.add('active');
			}
		}, 90);
		setScore(boom);
		clicks ++;
		scoreText.textContent = score + ' points';
	}

	function onMove (event) {
		if (pointCollection) {
			pointCollection.mousePos.set(event.pageX, event.pageY);
		}
	}

	function onBgMouseMove (event) {
		bg.style[transformStyle] = 'perspective(1000px) rotate(' + -(window.innerWidth - event.pageX) * 0.01 + 'deg)' + 'scale(2)';
	}

	function onVisible () {
		if (document.visibilityState === 'hidden') {
			unbindEvents();
		}
		else {
			bindEvents();
		}
	}
	
	/*
	* core
	*/

	function timeout () {
		if (!isEnabled) {
			return false;
		}
		draw();
		update();
		window.setTimeout(timeout, REDRAW_INT);

	}
	
	function draw () {

		if (canvas.getContext === null) {
			return; 
		}

		// update canvas
		ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);

		// draw point
		if (pointCollection) {
			pointCollection.draw();
		}

	}
	
	function update () {	
		if (pointCollection) {
			pointCollection.update();
		}
	}

	function restart () {
		console.log('destroyer : reset');
		unbindEvents();
		restartButton.classList.remove('active');
		reset = 1;
		clicks = 0;
		score = 0;
		isEnabled = true;
		// depending on boom size the click event may leave artifacts
		// so we delay out call to restart drawing
		window.setTimeout(function () {
			reset = 0;
			bindEvents(true);
		}, 1000);
	}		
	
	/*
	* constructors
	*/

	function Vector (x, y, z) {

		this.x = x;
		this.y = y;
		this.z = z;
 
		this.addX = function (x) {
			this.x += x;
		};
		
		this.addY = function (y) {
			this.y += y;
		};
		
		this.addZ = function (z) {
			this.z += z;
		};
 
		this.set = function (x, y, z) {
			this.x = x; 
			this.y = y;
			this.z = z;
		};

	}
	
	function PointCollection () {

		this.mousePos = new Vector(0, 0, 0);
		this.points = new Array();

		this.newPoint = function (x, y, z) {
			var point = new Point(x, y, z);
			this.points.push(point);
			return point;
		};
		
		this.update = function () {	

			var pointsLength = this.points.length,
				dx, dy, dd, d,
				point,
				i;
			
			for (i = 0; i < pointsLength; i ++) {

				point = this.points[i];
				
				if (point === null) {
					continue;
				}
					
				dx = this.mousePos.x - point.curPos.x;
				dy = this.mousePos.y - point.curPos.y;

				dd = (dx * dx) + (dy * dy);
				d = (!reset) ? (Math.abs(dd / boom) >> 0) : (Math.sqrt(dd) / 2) >> 0;

				if (d < 20) {
					point.targetPos.x = point.curPos.x + (dx * boom);
					point.targetPos.y = point.curPos.y + (dy * boom);
				}
				else { // move back

					if (!reset) {
						point.curPos.x += (dx * 0.026) * (boom / 8);
						point.curPos.y += (dy * 0.026) * (boom / 8);
					}
					else {
						point.targetPos.x = point.originalPos.x;
						point.targetPos.y = point.originalPos.y;
					}
					
				}

				point.update();

			}

		};
		
		this.draw = function () {

			var point;

			for (var i = 0, len = this.points.length; i < len; i ++) {
				point = this.points[i];
				if (point === null) {
					continue;
				}
				point.draw();
			}

		};

	}
	
	function Point (x, y, z, size) {

		this.curPos = new Vector(x, y, z);
		this.friction = 0.3;
		this.originalPos = new Vector(x, y, z);
		this.radius = size;
		this.size = size;
		this.springStrength = 0.2;
		this.targetPos = new Vector(x, y, z);
		this.velocity = new Vector(0, 0, 0);
		
		this.update = function () {

			var dx = this.targetPos.x - this.curPos.x,
				ax  = dx * this.springStrength;

			this.velocity.x += ax;
			this.velocity.x *= this.friction;
			this.curPos.x += this.velocity.x;
			
			var dy = this.targetPos.y - this.curPos.y,
				ay = dy * this.springStrength;

			this.velocity.y += ay;
			this.velocity.y *= this.friction;
			this.curPos.y += this.velocity.y;
			
			var dox = this.originalPos.x - this.curPos.x,
				doy = this.originalPos.y - this.curPos.y,
				dd = (dox * dox) + (doy * doy),
				d = Math.sqrt(dd);
			
			this.targetPos.z = (d / 100) + 1;

			var dz = this.targetPos.z - this.curPos.z,
				az = dz * this.springStrength;

			this.velocity.z += az;
			this.velocity.z *= this.friction;
			this.curPos.z += this.velocity.z;
			
			this.radius = this.size * this.curPos.z;

			if (this.radius < 1) {
				this.radius = 1;
			}

		};
		
		this.draw = function () {
			
			var base = (Math.abs(boom) * this.velocity.z * 10) >> 0,
				gb = (30 + (base + this.targetPos.z * 2 + boom) >> 0);

			ctx.fillStyle = 'rgb(' + (30 + (base + this.targetPos.z * 10) >> 0)
							+ ', ' + gb
							+ ', ' + gb
							+ ')';

			ctx.fillRect(this.curPos.x, this.curPos.y, this.radius, this.radius);

		};

	}
	
	function init () {
		console.log('destroyer : init : ', REDRAW_INT);
		updateCanvasDimensions();
		drawCanvasText('DESTROY', postInit);
		document.addEventListener('visibilitychange', onVisible, false);
		window.B.destroyer.scroller.init();
	}

	function getEnabled() {
		return isEnabled;
	}

	return {
		init: init,
		disable: unbindEvents,
		enable: bindEvents,
		getEnabled: getEnabled,
		restart: restart,
		canvasHeight: canvasHeight
	};

}(window.B.utils));

/*
* listens for scroll position to kill expensive
* and reflow-triggering destroyer listeners when they arent needed
* flatlining the memory tab = good ux !
*/

window.B.destroyer.scroller = (function (destroyer) {

	function onScroll () {
		if ((window.scrollY > destroyer.canvasHeight) && destroyer.getEnabled()) {
			destroyer.disable();
		}
		else if ((window.scrollY < destroyer.canvasHeight) && !destroyer.getEnabled()) {
			destroyer.enable();
		}
	}

	function init () {
		window.addEventListener('scroll', onScroll, false);
	}

	return {
		init: init
	}

}(window.B.destroyer));