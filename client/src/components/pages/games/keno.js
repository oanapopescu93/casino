import React, {useEffect, useState, useRef} from 'react';
import $ from 'jquery';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { showResults } from '../../utils';
import { craps_calculate_money, craps_get_history } from '../../actions/actions';
import { useDispatch } from 'react-redux'
import under_construction_icon from '../../img/icons/under_construction_icon.png'

function Keno(props){
	let lang = props.lang;
	let socket = props.socket;
	let dispatch = useDispatch();

	const [title, setTitle] = useState("");

	useEffect(() => {
		if (window.innerWidth >= 960){
			setTitle("Keno");		
		} else {
			setTitle("");
		}
		$(window).resize(function(){
			if (window.innerWidth >= 960){
				setTitle("Keno");		
			} else {
				setTitle("");
			}
		});
	}, []); 

	return (
		<>
			<Row>
				<Col sm={2}></Col>
				<Col xs={10} sm={8} className="keno_container spacing_small">	
					<h1 className="craps_title">{title}</h1>					
					<img className="under_construction_icon" alt="under construction" src={under_construction_icon} />
				</Col>
				<Col sm={2}></Col>
			</Row>
		</>
	)
}

export default Keno;