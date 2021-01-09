import React from 'react';

function Footer(){
	var date = new Date();
	date = date.getFullYear();
	return (
		<div className="footer_container">
			<footer className="text-center"><h6>Copyright &copy; <span id="copyright_year">{date}</span> Oana Popescu. All rights reserved.</h6></footer>
		</div>
	);
}

export default Footer;