(function (utils) {

	// boot modules for all platforms
	window.B.images.init();
	window.B.contact.init();

	// readystate must be complete for webfonts to work with canvas
	// so `DOMContentLoaded` is not what we need
	// we also dont want this running on phones
	document.onreadystatechange = function () {
		if (document.readyState === 'complete'
			&& window.B.destroyer
			&& !utils.isMobile()) {
			window.B.destroyer.init();
		}
	}

	// for fun
	console.log('nice to see you, here\'s an');
	console.dir(window.B);

}(window.B.utils));