window.B.contact = (function (utils) {

	'use strict';

	var el,
		messages = {
			name: 'What is your name?',
			email: 'Invalid email address',
			message: 'Enter a message',
			success: '<h3>Thanks!</h3> Hey, your message was sent.',
			failure: '<h3>Oh No!</h3> There was an error sending your message. '
					+ 'Would you like to <a href="mailto:brad@bcandullo.com" target="_blank">open an email message?</a>'
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

		// format message
		el.error.textContent = messages[type];
		el.error.classList.add('active');
		el.error.style.top = el[type].parentElement.offsetTop + 'px';
		el.error.style.left = el[type].parentElement.offsetLeft + 'px';

		// class parent (row) node
		el[type].parentNode.classList.add('error');

		// listen for change
		el[type].addEventListener('keyup', listenForValidation, false);
		el[type].focus();

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

		el.submit.classList.add('load');
		setTimeout(function () {
			el.submit.classList.remove('load');
		}, 2000);	

		// disable form
		/*toggleForm(true);
		el.form.classList.add('sent');*/

		// callback for ajax success
		var success = function () {
			el.status.success.innerHTML = messages.success;
			el.status.success.classList.add('active');
			el.submitText.textContent = 'Sent';
		};

		// callback for any ajax error
		var failure = function () {
			el.status.failure.innerHTML = messages.failure;
			el.status.failure.classList.add('active');
			el.submitText.textContent = 'Error';
		}

		return false;

		// build data
		var data = {
			user: el.name.value,
			email: el.email.value,
			message: el.message.value
		};

		// send xhr
		utils.ajax({
			url: 'http://128.0.0.1',
			data: JSON.stringify(data),
			success: success,
			failure: failure
		});

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
			submitText: $('.btn-text'),
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

}(window.B.utils));