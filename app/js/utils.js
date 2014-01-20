window.B.utils = (function () {

	/*
	* check for touch events - ala modernizr
	*/

	(function touched () {
  		var isTouch = 'ontouchstart' in window || 'onmsgesturechange' in window,
  			className = isTouch ? 'touch' : 'no-touch';
  		$('html').classList.add(className);
	}());

	/*
	* helper functions
	*/

	return {

		isMobile: function () {
			return (/iPhone|iPod|iPad|Android|BlackBerry/).test(navigator.userAgent);
		},

		loadScript: function (url) {
			var script = document.createElement('script');
				script.setAttribute('src', url);
			document.getElementsByTagName('head')[0].appendChild(script)
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
				method = obj.method || 'post';

			req.onreadystatechange = function (response) {
				console.log('ajax : state change : ' + req.readyState);
				if (req.readyState === 4) {
					if (req.status === 200) {
						console.log('ajax : response from server');
						obj.success.call();
					}
				}
				else {
					obj.failure.call();
					throw new Error('ajax : readystate not complete');
				}
			};

			req.open(method, obj.url);
			req.send(obj.data);

		}

	}


}());