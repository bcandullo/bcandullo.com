<?php

	#
	# todo:
	# server-side check for valid fields
	#

	// check for direct access
	if (!isset($_POST['user']) && !isset($_POST['email']) && !isset($_POST['message'])) {
		die('boo');
	}

	function cleanString ($str) {
		return trim(stripslashes(strip_tags($str)));
	}

	// define our vars
	$user = cleanString($_POST['user']);
	$email = cleanString($_POST['email']);
	$message = cleanString($_POST['message']);

	// build our email
	$to = 'brizad@gmail.com';
	$subject = '{{bcandullo.com}} website email from ' . $user;
	$headers = "From: " . $email . "\r\n";
	$headers .= "Reply-To: ". $email . "\r\n";
	$headers .= "MIME-Version: 1.0\r\n";
	$headers .= 'X-Mailer: PHP/' . phpversion() . "MIME-Version: 1.0\r\n";
	$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
	$body = '<html><body>';
	$body .= '<h2>' . $user . ' says:</h2>';
	$body .= $message;
	$body .= '<br><br><p><small>Sent on: ' . date('F j, Y, g:i A') . '</small></p>';
	$body .= '</body></html>';

	// send mail
	if (mail($to, $subject, $body, $headers)) {
		echo 1;
	}
	else {
		echo 0;
	}

?>