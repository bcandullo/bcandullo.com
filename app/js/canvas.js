window.B.canvas = (function (utils) {

	'use strict';

	var REDRAW_INT = 18; // ms, higher is slower but easier on cpu
	var LETTER_DENSITY = 6; // higher = less dense, easier to draw
	var MAX_DISTANCE = 30; // maxmium explosion distance

	var score = 0,
		scoreText = $('.score'),
		boom = 1,
		canvas = $('.destroyer'),
		canvasOffsetY = 320,
		ctx,
		clicks = 0,
		reset = false,
		pointCollection,
		canvasWidth,
		canvasHeight = $('.intro').offsetHeight,
		restartButton = $('[data-js=restart]')

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
        	idHeight = imagedata.height;

        for (x = 0; x < idWidth; x += LETTER_DENSITY) {

            for (y = 0; y < idHeight; y += LETTER_DENSITY) {

                var index = (y * 4) * idWidth + x * 4;
                
                var r = imagedata.data[index],
                	g = imagedata.data[index + 1],
                	b = imagedata.data[index + 2],
                	a = imagedata.data[index + 3];
                
                if (r | g | b | a) {
                        var p = new Point(x + canvasWidth / 2 - imgwidth / 2,
                        					y,
											0.0, 
											LETTER_DENSITY / 2);
                        
                        points.push(p);
                }
            };

        };

        if (typeof callback === 'function') {
        	callback(points);
        }

    }

    function postInit (points) {
        pointCollection = new PointCollection();
        pointCollection.points = points;
        bindEvents();
        timeout();
    }

    function preview () {

		var speed = 10,
			c = 0,
			max = Math.floor( Math.sqrt(window.innerWidth) * 0.5 );

		boom = 4;

		window.int = window.setInterval(function() {

			if (c > max) {
				clearInterval(window.int);
				boom = 1;
			}

			pointCollection.mousePos.set(c * 70, canvasOffsetY - 30);
			c += 1;


		}, speed);

    }

	function bindEvents () {
		//window.addEventListener('resize', updateCanvasDimensions, false);
		canvas.addEventListener('mousemove', onMove, false);
		canvas.addEventListener('click', onClick, false);
		canvas.addEventListener('touchstart', onClick, false); //
		restartButton.addEventListener('click', restart, false);
	}

	function unbindEvents() {
		canvas.removeEventListener('mousemove', onMove);
		canvas.removeEventListener('click', onClick);
	}
	
	// initial canvas sizing
	function updateCanvasDimensions() {
		canvas.setAttribute('width', window.innerWidth);
		canvas.setAttribute('height', canvasHeight);
		canvasWidth = canvas.width;
		draw();
	}
	
	function setScore (amount) {
		score += (Math.abs(amount) / 2) >> 0;
		console.log('destroyer : new score : ' + score);
	}

	function onClick () {
    	boom = -(Math.random() * MAX_DISTANCE) - 10; // random explosion size calculation
		window.setTimeout(function() {
			boom = 1;
			if (!restartButton.classList.contains('active')) {
				restartButton.classList.add('active');
			}
		}, 190);
		setScore(boom);
		clicks ++;
		scoreText.textContent = score + ' points';
	}

	function onMove (event) {
		if (pointCollection) {
			pointCollection.mousePos.set(event.pageX, event.pageY);
		}
	}
	
	function timeout () {
		draw();
		update();
		window.setTimeout(timeout, REDRAW_INT);
	}
	
	function draw () {

		if (canvas.getContext === null) {
			return; 
		};

		ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);

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
		window.setTimeout(function () {
			reset = 0;
			bindEvents();
		}, 100);
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

			};
		};
		
		this.draw = function () {

			var pointsLength = this.points.length,
				point,
				i;

			for (i = 0; i < pointsLength; i ++) {

				point = this.points[i];
				
				if (point === null) {
					continue;
				}

				point.draw();
			};

		};

	}
	
	function Point (x, y, z, size, color) {

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
			
			var base = (Math.abs(boom) * this.velocity.z * 5) >> 0,
				gb = (30 + (base + this.targetPos.z * 2) >> 0);

			ctx.fillStyle = 'rgb(' + (30 + (base + this.targetPos.z * 10) >> 0)
							+ ', ' + gb
							+ ', ' + gb
							+ ')';

			ctx.fillRect(this.curPos.x, this.curPos.y, this.radius, this.radius);

		};

	}
	
	function init () {
		console.log('destroyer : init');
		updateCanvasDimensions();
		drawCanvasText('DESTROY', postInit);
		window.setTimeout(preview, 400);
	}

	return {
		init: init,
		destroy: unbindEvents,
		restart: restart
	};

}(window.B.utils));