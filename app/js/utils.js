window.B.utils = (function () {

	/*
	* helper functions
	*/

	function isEmpty (str) {
		return str.replace(/\s+/g, '') !== '';
	}

	function isEmail (str) {
		return /\S+@\S+\.\S+/.test(str);
	}

	function ajax (obj) {

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

	return {
		isEmpty: isEmpty,
		isEmail: isEmail,
		ajax: ajax
	}

}());