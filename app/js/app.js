(function () {

	// boot modules for all platforms
	window.B.contact.init();

	// load project browser if client isnt mobile os
	if (!window.B.utils.isMobile()) {
		window.B.utils.loadScript('js/browser.js');
	}

	// load canvas for devices with mouse input only
	if (true) { // $('html').classList.contains('no-touch')

		window.B.utils.loadScript('js/canvas.js');

		// readystate must be complete for webfonts to work with canvas
		document.onreadystatechange = function () {
			if (document.readyState === 'complete') {
				if (window.B.canvas) {
					window.B.canvas.init();
				}
				if (window.B.browser) {
					window.B.browser.init();
				}
			}
		}

	}

	// for fun
	console.log('nice to see you, have an object');
	console.log(window.B);

}());