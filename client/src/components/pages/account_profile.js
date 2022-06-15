import React, { useState, useEffect, Component } from 'react';
import { useSelector} from 'react-redux'
import $ from 'jquery'; 

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { setCookie} from '../utils';
import History from './partials/history';

import profilePic from '../img/profile/predators.jpg';

class Picture extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id:props.id,
			socket:props.socket,
			lang: props.lang,
			picture: false,
		}
		this.renderPreview = this.renderPreview.bind(this);
		this.handlePictureSelected = this.handlePictureSelected.bind(this);		
		this.upload = this.upload.bind(this);
		this.choosePic = this.choosePic.bind(this);
	}
	
	renderPreview() {
		let pic_id = this.props.pic_id;
		if(pic_id !== 0 && pic_id !== '0') {
			return(
				<div className="profile_pic">
					<div className="crop_profile_pic">
						<img alt="profile_pic" className={"profile_pic pic_"+pic_id} src={profilePic}/>
					</div>
				</div>
			);
		} else {
			return(
				<div className="profile_pic"><i className="fa fa-user"></i></div>
			);
		}
	}
	handlePictureSelected(event) {
		let picture = event.target.files[0];
		let src = URL.createObjectURL(picture);	  
		this.setState({
		  	picture: picture,
		  	src: src
		});
		this.upload(picture);
	}
	upload(picture) {
		let formData = new FormData();	  
		formData.append("file", picture);
		console.log(this.state.id, formData)
		this.state.socket.emit('profile_pic_send', {id: this.state.id, pic: formData});	
	}

	choosePic(){
		this.props.choice();
	}

	render() {
		return (		
			<div className="profile_pic_container" onClick={this.choosePic}>
				<div className="profile_pic_default"><i className="fa fa-upload"></i></div>
				{this.renderPreview()}
			</div>
		);
	}
}

function Account_profile(props) {	
	let username = props.info.user;
	let lang = props.lang;
	let socket = props.info.socket;	
	let pic = props.info.profile_pic[0] ? props.info.profile_pic[0] : "0";
	let animal = null;
	let profiles = []	
	if(props.info.profile_pic[1]){		
		animal = props.info.profile_pic[1][0];
	}

	let roulette_info = useSelector(state => state.roulette);
	let blackjack_info = useSelector(state => state.blackjack);
	let slots_info = useSelector(state => state.slot);
	let craps_info = useSelector(state => state.craps);
	let race_info = useSelector(state => state.race);
	
	const [show1, setShow1] = useState(false);
	const [show2, setShow2] = useState(false);
	const [pic_id, setPicId] = useState(pic);
	const [pic_animal, setPicAnimal] = useState(animal);
	const [profiles_array, setProfiles_array] = useState([]);
	
	socket.emit('profile_send', {id: props.info.user_id});
	socket.on('profile_read', function(data){		
		profiles = data;
	});
	
	function handleClose_pic(){ 
		setShow1(false) 
	};
    function handleShow_pic(){ 
		setProfiles_array(profiles)
		setShow1(true) 
	};
	function handleClose_user(){ 
		setShow2(false) 
	};
    function handleShow_user(){ 
		setShow2(true) 
	};
	
	let money = props.info.money;
	let history = {
		roulette: null,
		blackjack: null,
		slots: null,
		craps: null,
		race: null
	};	
	if(roulette_info !== -1){		
		money = roulette_info[0].money;
		history.roulette = roulette_info[1].history;
	}
	if(blackjack_info !== -1){		
		money = blackjack_info[0].money;
		history.blackjack = blackjack_info[1].history;
	}
	if(slots_info !== -1){		
		money = slots_info[0].money;
		history.slots = slots_info[1].history;
	}
	if(craps_info !== -1){		
		money = craps_info[0].money;
		history.craps = craps_info[1].history;
	}
	if(race_info !== -1){		
		money = race_info[0].money;
		history.race = race_info[1].history;
	}

	let transactions = [];

	function buy_carrots(){
		if(lang === "ro"){
			alert('Nu exista metoda de plata inca.')
		} else {
			alert('No payment methods yet.')
		}
	}
	function change_username(){
		let input = $('#change_username').val();
		if(typeof input !== "undefined" && input !== "null" && input !== null && input !== ""){
			setCookie("casino_user", input, 1);
			$('#profile_user_text').text(input);
			socket.emit('change_username_send', {id: props.info.user_id, user_new: input});
			handleClose_user();
		}
    }

	function change_pic(){
		setPicId(animal.id);	
		setPicAnimal(animal);
		handleClose_pic();
		socket.emit('change_pic_send', {id: props.info.user_id, pic: pic});
	}

	function choosePic(e){
		pic = e.id;
		animal = e;
	}
	
	return (
		<>
			<Row className="account_box_container color_yellow">
				<Col sm={2}></Col>
				<Col sm={8}>					
					<Row>				
						<Col sm={12}>{lang === "ro" ? <h2>Profil</h2> : <h2>Profile</h2>}</Col>
					</Row>
					<Row className="profile_container">
						<Col sm={4} className="profile_container_left">
							<div className="profile_left shadow_concav">								
								{lang === "ro" ? <h3>Informatii utilizator</h3> : <h3>User info</h3>}
								<Row>
									<Col lg={6}>
										<Picture profiles={profiles} pic_id={pic_id} choice={handleShow_pic} id={props.info.user_id} socket={socket} lang={lang}></Picture>
									</Col>
									<Col lg={6}>
										<p className="profile_user">{lang === "ro" ? <b>User: </b> : <b>Username: </b>}<span id="profile_user_text">{username}</span></p>
										<p className="profile_animal">
											{lang === "ro" ? <b>Animal: </b> : <b>Animal: </b>}
											{lang === "ro" ? <>{pic_animal.name_ro}</> : <>{pic_animal.name_eng}</>}
										</p>
										<p className="profile_money">{lang === "ro" ? <b>Morcovi: </b> : <b>Carrots: </b>}{money}</p>
									</Col>
								</Row>								
								<div id="profile_change_username" className="profile_button button_yellow" onClick={handleShow_user}>Change username</div>
								<div id="profile_buy_carrots" className="profile_button button_yellow" onClick={buy_carrots}>Buy carrots</div>
							</div>
						</Col>
						<Col sm={8} className="profile_container_left hidden-xs">
							<div className="profile_right shadow_concav">								
								<History lang={lang} history={history} transactions={transactions}></History>
							</div>
						</Col>
					</Row>
				</Col>
				<Col sm={2}></Col>
			</Row>

			<Modal className="casino_modal" id="change_picture_modal" show={show1} onHide={handleClose_pic} size="sm">
				<Modal.Header closeButton>
					<Modal.Title>{lang === "ro" ? <span>Alege imaginea</span> : <span>Change the image</span>}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="crop_profile_pic_container">
						{							
							profiles_array.map(function(item, i){
								return(
									<div key={i} className="crop_profile_pic_box">										
										{lang === "ro" ? <p>{item.name_ro}</p> : <p>{item.name_eng}</p>}
										<input type="radio" id={item.id} name="radio-group" onChange={() => choosePic(item)}></input>
										<label htmlFor={item.id}>
											<div className="crop_profile_pic shadow_convex">
												<img alt="profile_pic" className={"profile_pic pic_"+item.id} src={profilePic}/>
											</div>
										</label>
									</div>
								);
							})
						}
					</div>
					<Button className="change_pic_button shadow_convex" type="button" onClick={() => change_pic()}>
						{lang === "ro" ? <span>Schimba</span> : <span>Change</span>}
					</Button>
				</Modal.Body>				
			</Modal>

			<Modal className="casino_modal" id="change_username_modal" show={show2} onHide={handleClose_user} size="sm">
				<Modal.Header closeButton>
					<Modal.Title>{lang === "ro" ? <span>Schimba nume user</span> : <span>Change username</span>}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<input className="change_username_input" type="text" id="change_username"></input>
					<Button className="change_username_button shadow_convex" type="button" onClick={() => change_username()}>
						{lang === "ro" ? <span>Schimba</span> : <span>Change</span>}
					</Button>
				</Modal.Body>				
			</Modal>
		</>
	);
}

export default Account_profile;
