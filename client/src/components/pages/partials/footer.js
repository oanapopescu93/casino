import React from 'react';
import $ from 'jquery'; 
import { connect } from 'react-redux';
import {game_visible} from '../../actions/actions'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import ukraine from '../../img/icons/ukraine.svg';

function Footer(props){
	var dispatch = props.dispatch;
	var lang = props.lang;

	var date = new Date();
	date = date.getFullYear();

	setTimeout(function(){ 	
		var existCondition = setInterval(function () {		
			if ($('#salon').length > 0) {
				clearInterval(existCondition);
				$('.footer_container').show();
			}
		}, 100);

        $('body').off('click').on('click', function(event) {
            if($(event.target).closest(".footer_container").length === 0){
                $('.footer_container').removeClass('open');
            }
        });

        $('.footer_button').off('click').on('click', function(event) {
			$('.footer_container').toggleClass('open');
		});
	}, 0);

	function handleClick(link) {
		dispatch(game_visible(link))
	}

	return (
		<div className="footer_container">
			<div className="footer_button">
				<h6>Footer</h6>
			</div>
			<div className="footer_box">
				<Container>	
					<Row>
						<Col sm={12} className="box_info">
							<ul>
								<li onClick={() => handleClick('about')}>{lang === "ro" ? <span>Despre noi</span> : <span>About us</span>}</li>
								<li onClick={() => handleClick('support')}>{lang === "ro" ? <span>Contact</span> : <span>Contact us</span>}</li>
								<li onClick={() => handleClick('terms')}>{lang === "ro" ? <span>Termeni si conditii</span> : <span>Terms and Conditions</span>}</li>
								<li onClick={() => handleClick('privacy')}>{lang === "ro" ? <span>Politica de confidentialitate</span> : <span>Privacy policy</span>}</li>
								<li onClick={() => handleClick('questions')}>{lang === "ro" ? <span>Intrebari</span> : <span>Questions</span>}</li>
								<li onClick={() => handleClick('career')}>{lang === "ro" ? <span>Cariera</span> : <span>Career</span>}</li>
								<li><img id="ukraine_icon" alt="ukraine_icon" src={ukraine} style={{"width": "20px"}}></img></li>
							</ul>
						</Col>
					</Row>
					<Row>
						<Col sm={12}>
							<footer className="text-center"><h6>Copyright &copy; <span id="copyright_year">{date}</span> BunnyBet. All rights reserved.</h6></footer>
						</Col>
					</Row>
					</Container>				
			</div>
		</div>
	);
}

function mapStateToProps(state) {	
	return { ...state }
}

export default connect(mapStateToProps)(Footer)