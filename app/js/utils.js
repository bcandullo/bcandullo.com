window.B.utils = (function () {

	/*
	* support 1st gen ipad (function.prototype.bind)
	* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
	*/

	if (!Function.prototype.bind) {
		Function.prototype.bind = function (oThis) {
			var aArgs = Array.prototype.slice.call(arguments, 1), 
				fToBind = this, 
				fNOP = function () {},
				fBound = function () {
					return fToBind.apply(this instanceof Function && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
				};
			fNOP.prototype = this.prototype;
			fBound.prototype = new fNOP();
			return fBound;
		};
	}

	window.$ = document.querySelector.bind(document);
	window.$$ = document.querySelectorAll.bind(document);

	/*
	* check for touch events
	* also, webkit
	*/

	(function () {
  		var isTouch = 'ontouchstart' in window || 'onmsgesturechange' in window,
  			classes = [isTouch ? 'touch' : 'no-touch'];
  		DOMTokenList.prototype.add.apply($('html').classList, classes);
	}());
	
	/*
	* helper functions
	*/

	return {

		isMobile: function () {
			return (/iPhone|iPod|Android|BlackBerry/).test(navigator.userAgent);
		},

		loadScript: function (url, cb) {
			var script = document.createElement('script');
				script.setAttribute('src', url);
			document.getElementsByTagName('head')[0].appendChild(script);
			if (typeof cb === 'function') {
				script.addEventListener('load', cb);
			}
		},

		insertTemplate: function (el, tpl, position) {
			var position = position || 'afterend';
			el.insertAdjacentHTML(position, tpl);
		},

		objLength: function (obj) {
			return Object.keys(obj).length;
		},

		toArray: function (list) {
			return Array.prototype.slice.call(list, 0);
		},

		isEmpty: function (str) {
			return str.replace(/\s+/g, '') !== '';
		},

		isEmail: function (str) {
			return /\S+@\S+\.\S+/.test(str);
		},

		ajax: function (obj) {

			var req = new XMLHttpRequest(),
				method = obj.method || 'get';

			req.onreadystatechange = function () {
				if (req.readyState === 4) {
					if (req.status === 200 && typeof obj.success === 'function') {
						obj.success.call(this, req.responseText);
					}
					else if (typeof obj.failure === 'function') {
						obj.failure.call();
					}
				}	
			};

			req.open(method, obj.url);

			if (method.toLowerCase() === 'post') {
				req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			}

			req.send(obj.data);

		}

	}

}());