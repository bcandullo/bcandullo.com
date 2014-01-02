<?php
	
	echo 'success';
	exit();

	// check for direct access
	if (!isset($_POST['user']) && !isset($_POST['email']) && !isset($_POST['message'])) {
		die('what are you looking for?');
	}

	function cleanString ($str) {
		return trim(stripslashes($str));
	}

	// define our variables
	$user = cleanString($_POST['user']);
	$email = cleanString($_POST['email']);
	$message = cleanString($_POST['message']);

	// send mail
	echo 'success';

?>