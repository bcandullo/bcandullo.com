(function () {

	// boot modules for all platforms
	window.B.images.init();
	window.B.contact.init();

	// load canvas for devices with mouse input only
	if (true) { // $('html').classList.contains('no-touch')

		window.B.utils.loadScript('js/destroyer.js');

		// readystate must be complete for webfonts to work with canvas
		document.onreadystatechange = function () {
			if (document.readyState === 'complete') {
				if (window.B.destroyer) {
					window.B.destroyer.init();
				}
			}
		}

	}

	// for fun
	console.log('nice to see you, have an object');
	console.log(window.B);

}());