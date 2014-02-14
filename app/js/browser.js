window.B.browser = (function (utils) {

	'use strict';

	var el, // all of our dom elements
		clickedButton, // button that launched the browser
		current = 0, // current image in json
		path = 'img/projects/', // root of all project images
		extension = '.jpg', // should always be jpgs
		currentProject, // stores currently viewed project
		currentScroll = 0;

	/*
	* project json
	*/

	$include "inc/projects.inc.js"

	/*
	* callbacks mapped from data-js attribute on elements
	*/

	var fn = {
		next: browseNext,
		previous: browsePrevious,
		browser: browseClick,
		close: function () {
			console.log('browser : close');
			el.browser.classList.remove('loaded');
			el.browser.classList.remove('loading');
			el.image.style.height = 0; // image sometimes pushes document height too far
			el.overlay.removeEventListener('click', fn.close);
			toggleBrowser(false);
			window.scroll(0, currentScroll);
		}
	};

	/*
	* core methods
	*/

	function currentProjectLength () {
		return utils.objLength(projects[currentProject].images) - 1;
	}

	function toggleBrowser (show) {
		if (show === true) {
			el.main.classList.add('inactive');
			el.browser.classList.add('active');
		} else {
			el.main.classList.remove('inactive');
			el.browser.classList.remove('active');
		}
	}

	function loadSuccess () {

		// set up browser if it isn't visible
		if (!el.browser.classList.contains('loaded')) {
			el.browser.style.cssText = 'top: ' +  window.scrollY + 'px';
			el.overlay.addEventListener('click', fn.close, false);
			toggleBrowser(true);
		}

		clickedButton.setAttribute('data-loaded', true);

		el.browser.classList.remove('loading');
		el.browser.classList.add('loaded');

		loadCleanup();

	}

	function loadCleanup () {

		if (clickedButton) {
			clickedButton.classList.remove('loading');
		}

		el.image.removeEventListener('load', loadSuccess);
		el.image.removeEventListener('error', loadCleanup);

	}

	function loadImage (delay) {

		var	image = projects[currentProject].images['image_' + current],
			imageUrl = path + currentProject + '/' + image;
			imageUrl += extension,
			delay = delay || 0;

		console.log('browser : load :', imageUrl);

		// reset (some browsers will flicker old image)
		el.image.setAttribute('src', '');
		el.image.style.height = 'auto';

		// show preloader
		el.browser.classList.remove('loaded');
		el.browser.classList.add('loading');

		// make request and handle response
		setTimeout(function () {
			el.image.addEventListener('load', loadSuccess, false);
			el.image.addEventListener('error', loadCleanup, false);
			el.image.setAttribute('src', imageUrl);
		}, delay);
		

	}

	function browseClick (event) {

		var target = (event.target.parentNode.nodeName === 'BUTTON') ? event.target.parentNode : event.target,
			delay = 0;

		clickedButton = target;
		currentProject = target.getAttribute('data-project');

		// dont show loader if project was loaded already
		if (!target.getAttribute('data-loaded')) {
			current = 0;
			delay = 400;
			target.classList.add('loading');
		}

		loadImage(delay);

		// store current y scroll for revert on close
		currentScroll = window.scrollY; 

	}

	function browseNext () {

		console.log('browser : next');

		// reset to first image
		if ((currentProjectLength() - 1) < current) {
			current = -1;
		}

		current ++;
		loadImage();

	}

	function browsePrevious () {

		console.log('browser : previous');

		// reset to last image
		if (0 > (current - 1)) {
			current = currentProjectLength() + 1;
		}

		current --
		loadImage();

	}

	function bindElements () {
		el.buttons.forEach(function (el, key) {
			el.addEventListener('click', fn[el.getAttribute('data-js')], false);
		});
	}

	function unbindElements () {
		el.buttons.forEach(function (el, key) {
			el.removeEventListener('click', fn[el.getAttribute('data-js')]);
		});
	}

	/*
	* public methods
	*/

	function init () {

		console.log('browser : init');

		// populate view elements
		el = {
			main: $('.sections'),
			browser: $('.browser'),
			close: $('button[data-js=close]'),
			image: $('img[data-js]'),
			overlay: $('.overlay'),
			buttons: utils.toArray($$('button[data-js]'))
		};

		// bind input on elements
		bindElements();

	}

	return {
		init: init
	};

}(window.B.utils));