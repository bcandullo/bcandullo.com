(function () {

	// support 1st gen ipad (function.prototype.bind)
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
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

	// bootsrap
	window.B = window.B || {};
	window.$ = document.querySelector.bind(document);
	window.$$ = document.querySelectorAll.bind(document);

}());