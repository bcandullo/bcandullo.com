window.B.images = (function (utils) {

	/*
	* this simply listens for window scroll and if it is greater than intro height / n
	* it will load all of the project cover images, then remove the listeners and commit suicide
	*/

	'use strict';

	var el,
		count = 0,
		loaded = false;

	function loadComplete () {

		console.log('images : loaded');

		loaded = true;

		if (window.B.browser) {
			window.B.browser.init();
		}
		else {
			throw('browser did not init');
		}

	}

	function imageLoaded (event) {
		count ++;
		//console.log('images : loaded :', count);
		event.target.removeEventListener('load', imageLoaded);
		if ((count + 1) >= el.images.length) { // hit at second to last
			// init project browser if client isnt mobile os
			if (!utils.isMobile() && !loaded) {
				loadComplete();
			}
		}
	}

	function loadImages () {

		console.log('images : loading...');

		utils.toArray(el.images).forEach(function (img) {
			var url = img.getAttribute('data-src');
			img.setAttribute('src', url);
			img.addEventListener('load', imageLoaded);
			// check for errors?
		});

		// we are done listening, die!
		window.removeEventListener('scroll', onScroll);			

	}

	function onScroll () {

		var y = window.scrollY || document.documentElement.scrollTop, // document is for ie
			trigger = (el.intro.offsetHeight / 2) - 400;

		if (y > trigger) {
			loadImages();
		}

	}

	function init() {

		console.log('images : init');

		// populate view elements
		el = {
			intro: $('.intro'),
			images: $$('img[data-src]')
		};

		window.addEventListener('scroll', onScroll, false);

	}

	return {
		init: init
	}

}(window.B.utils));