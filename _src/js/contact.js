var contactForm = (function () {

	'use strict';

	var el,
		messages = {
			name: 'Enter your name',
			email: 'Invalid email address',
			message: 'Enter a message',
			success: '<h3>Thanks!</h3> Hey, your message was sent'
		};

	/*
	* helper methods
	*/

	function isEmpty (str) {
		return str.replace(/\s+/g, '') !== '';
	}

	function isEmail (str) {
		return /\S+@\S+\.\S+/.test(str);
	}

	/*
	* validations for each input
	*/

	var validator = {
		name: function () {
			return isEmpty(el.name.value) && el.name.value.length > 2;
		},
		email: function () {
			return isEmpty(el.email.value) && isEmail(el.email.value);
		},
		message: function () {
			return isEmpty(el.message.value) && el.message.value.length > 2;
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
		el.error.textContent = '';
		el.error.classList.remove('active');

		// style parent to target children
		target.parentNode.classList.remove('error');
		target.removeEventListener('keyup', listenForValidation);

	}

	function showError (type) {

		console.error('form : error : ' + type);

		// format message
		el.error.textContent = messages[type];
		el.error.classList.add('active');

		// style parent to target children
		el[type].parentNode.classList.add('error');
		el[type].addEventListener('keyup', listenForValidation, false);

	}

	function toggleForm (bool) {
		if (bool === true) {
			el.form.classList.add('disabled');
			unbindElements();
		}
		else {
			el.form.classList.remove('disabled');
			bindElements();
		}
	}

	function sendForm () {

		console.log('form : sending...');

		toggleForm(true);

		// make ajax request then
		if (true) {
			el.form.classList.add('sent');
			el.status.success.innerHTML = messages.success;
			el.status.success.classList.add('active');
		}
		else { // error
			el.status.failure.innerHTML = messages.failure;
			el.status.failure.classList.add('active');
			toggleForm(false);
		}

		
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

	function bindElements () {
		el.submit.addEventListener('click', validate, false);
	}

	function unbindElements () {
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
			submit: $('.btn-submit'),
			error: $('.error-message'),
			status: {
				failure: $('.success-message'),
				success: $('.success-message')
			}
		};

		// bind input on elements
		bindElements();

	}

	return {
		init: init
	};

}());