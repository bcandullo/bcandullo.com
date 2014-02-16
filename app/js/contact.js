window.B.contact = (function (utils) {

	'use strict';

	var el,
		messages = {
			name: 'What is your name?',
			email: 'Invalid email address',
			message: 'Enter a message',
			success: '<i class="icon-paper-plane"></i><h3>Thanks!</h3>Your message was successfully sent.',
			failure: '<i class="icon-warning"></i><h3>Oh No!</h3> There was an error sending your message. '
					+ 'Would you like to <a href="mailto:brizad@gmail.com" target="_blank">open an email message?</a>'
		};

	/*
	* validations for each input
	*/

	var validator = {
		name: function () {
			return utils.isEmpty(el.name.value) && el.name.value.length > 2;
		},
		email: function () {
			return utils.isEmpty(el.email.value) && utils.isEmail(el.email.value);
		},
		message: function () {
			return utils.isEmpty(el.message.value) && el.message.value.length > 2;
		}
	};

	/*
	* core methods
	*/

	function listenForValidation (event) {
		var target = event.target,
			type = target.attributes['data-type'].value;
		if (validator[type].call()) {
			console.log('form : ' + type + ' has become valid');
			hideError(target);
		}
	}

	function hideError (target) {

		// format message
		el.error.classList.remove('active');

		// style parent to target children
		target.parentNode.classList.remove('error');
		target.removeEventListener('keyup', listenForValidation);

	}

	function showError (type) {

		console.log('form : error : ' + type);

		var element = el[type];

		// format error message
		el.error.classList.add('active');
		el.error.style.cssText = 'top: ' + element.parentElement.offsetTop + 'px'
								+ '; left: ' + element.parentElement.offsetLeft + 'px'
								+ '; width: ' + (utils.isMobile() ? window.getComputedStyle(element).width : 'auto');

		el.errorText.textContent = messages[type];

		// class parent (row) node
		element.parentNode.classList.add('error');

		// listen for change
		element.addEventListener('keyup', listenForValidation, false);
		element.focus();

	}

	function toggleForm (bool) {
		if (bool === true) {
			el.form.classList.add('disabled');
			unbindEvents();
		}
		else {
			el.form.classList.remove('disabled');
			bindEvents();
		}
	}

	function sendForm () {

		console.log('form : sending...');

		var query = [],
			key;

		// callback for ajax success
		var success = function (response) {
			if (response === '1') {
				console.log('form : success from server');
				el.status.innerHTML = messages.success;
				el.status.classList.add('active', 'success');
				el.form.classList.add('sent');
			}
			else {
				failure();
			}
		};

		// callback for any ajax error
		var failure = function () {
			el.status.innerHTML = messages.failure;
			el.status.classList.add('active', 'failure');
			el.form.classList.add('sent');
			throw new Error('form : error');
		}

		// base data object
		var data = {
			user: el.name.value,
			email: el.email.value,
			message: el.message.value
		};

		// transform data to post-friendly url
	    for (key in data) {
	        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
	    }

		// send xhr
		utils.ajax({
			url: 'server/contact.php',
			data: query.join('&'),
			method: 'post',
			success: success,
			failure: failure
		});

		// disable form
		el.submit.classList.add('loading');
		toggleForm(true);
		
	}

	function validate (event) {

		event.preventDefault();

		var hasError = false;

		// runs the validation on target by name
		var checkTarget = function (target) {
			if (!hasError && !validator[target].call()) {
				showError(target);
				hasError = true;
			}
		};

		// check
		checkTarget('name');
		checkTarget('email');
		checkTarget('message');

		// send if no errors found
		if (!hasError) {
			sendForm();
		}

	}

	function bindEvents () {
		el.submit.addEventListener('click', validate, false);
	}

	function unbindEvents () {
		el.submit.removeEventListener('click', validate);
	}

	/*
	* public methods
	*/

	function init () {

		console.log('form : init');

		// populate view elements
		el = {
			form: $('.contact-form'),
			name: $('.input-name'),
			email: $('.input-email'),
			message: $('.input-message'),
			submit: $('[data-js=validate]'),
			error: $('.error-message'),
			errorText: $('.error-message-text'),
			status: $('.status-message')
		};

		// bind input on elements
		bindEvents();

	}

	return {
		init: init
	};

}(window.B.utils));