import React, { Component } from 'react';
import $ from 'jquery'; 
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import {connect} from 'react-redux'

import sky from '../../img/race_imgs/sky.png'
import clouds from '../../img/race_imgs/clouds.png'
import mountains from '../../img/race_imgs/mountains.png'
import hills_far from '../../img/race_imgs/hills_far.png'
import hills_near from '../../img/race_imgs/hills_near.png'
import road from '../../img/race_imgs/road.png'
import grass from '../../img/race_imgs/grass.png'

import rabbit_img from "../../img/race_imgs/rabbit.jpg"

var canvas_width = window.innerWidth;
var canvas_height = 800;
var my_race;
var canvas;
var ctx;
var rabbit_array = [];

var items = [
	{id: 'sky', src: sky},
	{id: 'clouds', src: clouds},
	{id: 'mountains', src: mountains},
	{id: 'hills_far', src: hills_far},
	{id: 'hills_near', src: hills_near},
	{id: 'road', src: road},
	{id: 'grass', src: grass},
];
var image_size = [1440, 800];
var font_title = 'bold 30px sans-serif';


function race_game(props){
	var self = this;
	self.images = [];
	var offset = 0;
		
	this.ready = function(){
		self.create_game();
	}

	this.create_game = function(){	
		self.createCanvas(canvas_width, canvas_height);	
		self.start();
	}

	this.start = function(){
		var promises = [];
		for(var i in items){				
			promises.push(self.preaload_images(items[i]));
		}

		Promise.all(promises).then(function(result){
			self.images = result;
			self.draw_background(offset);
			self.add_title();
		});	
	}

	this.run = function(){

	}

	this.add_title = function(){
		ctx.font = font_title;
		ctx.fillStyle = "black";
		ctx.textAlign = "center";
		ctx.fillText("Rabbit Race", canvas.width/2,  canvas.height*8/100);
	}

	this.draw_background = function(offset){
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for(var i in self.images){
			var img = self.images[i];
			var sx = 0
			var sy = 0
			var swidth = image_size[0];
			var sheight = image_size[1];
			var x = offset;
			var y = -100;
			var width = image_size[0];
			var height = image_size[1];
			if(img.id === "grass"){
				y = 400;
			}
			if(img.id === "road"){
				y = 450;
			}
			ctx.drawImage(img, sx, sy, swidth, sheight, x, y, width, height);
			ctx.drawImage(img, sx, sy, swidth, sheight, x+swidth, y, width, height);
		}
	}

	this.preaload_images = function(item){
		return new Promise(function(resolve, reject){
			var image = new Image();
			image.id = item.id;
			image.src = item.src;
			image.addEventListener("load", function() {
				resolve(image)
			}, false);
		});
	}

	this.createCanvas = function(canvas_width, canvas_height){		
		canvas = document.getElementById("race_canvas");		
		ctx = canvas.getContext("2d");
		
		if (window.innerWidth < 960){
			if(window.innerHeight < window.innerWidth){
				//small landscape				
				canvas.width = window.innerWidth;
				canvas.height = 300;
				image_size = [1440, 800]				
			} else {
				//small portrait
				canvas.width = window.innerWidth;
				canvas.height = 400;
				image_size = [1440, 800]
			}
			font_title = 'bold 20px sans-serif';
		} else {
			//big
			canvas.width = window.innerWidth;
			canvas.height = 800;
			image_size = [1440, 800];
			font_title = 'bold 30px sans-serif';	
		}
		
		canvas_width = canvas.width;
		canvas_height = canvas.height;		
		canvas.height = canvas_height;
	}
}

function RaceGame(props){
	var socket = props.socket;
	var lang = props.lang;
	var money = props.money;

	// var payload = {id: props.user_id}	
	// socket.emit('race_send', payload);
	// socket.on('race_read', function(data){	
	// 	rabbit_array = data;
	// });

	setTimeout(function(){ 
		my_race = new race_game(props);
		my_race.ready();
	}, 0);	

	return (
		<>
			<canvas id="race_canvas"></canvas>
			<div className="show_results_container">
				<div className="show_results">
					<h1>{lang === "ro" ? <span>Rezultate</span> : <span>Results</span>}</h1>
					<p></p>
				</div>
			</div>
		</>
	)
}

function RaceTables(props){
	var lang = props.data.lang;
	var money = props.data.money;
	var socket = props.data.socket;
	var rabbit_array = props.data.rabbit_array;
	var user = props.data.user;

	$('body').off('click', '#race_clear_bets').on('click', '#race_clear_bets', function () {
		$('.race_input').val('0');
	})

	$('body').off('click', '.rabbit_box_minus').on('click', '.rabbit_box_minus', function () {
		var input_value = parseInt($(this).parent().find('.race_input').val());
		if(input_value > 0){
			$(this).parent().find('.race_input').val(input_value-1)
		}
	})

	$('body').off('click', '.rabbit_box_plus').on('click', '.rabbit_box_plus', function () {
		var input_value = parseInt($(this).parent().find('.race_input').val());
		if(input_value < money){
			$(this).parent().find('.race_input').val(input_value+1)
		}
	})

	$('body').off('click', '#race_start').on('click', '#race_start', function () {
		props.get_data('tables')
	})

	return (
		<>
			<Row className="race_container">
				<Col sm={12} className="race">
					<h2>Under construction</h2>
				</Col>
			</Row>
			<Row>
				<Col sm={2}></Col>
				<Col sm={8} className="race_table_container">
					<Row>
						<Col sm={12}>
							<div className="race_table_header shadow_convex">
								<h3>
									{self.state.lang === "ro" ? 
										<span>Lista Iepuri</span> : 
										<span>List of Bunnies</span>
									}
								</h3>
							</div>
							<div className="race_table_body_container">
								<div className="race_table_body shadow_convex">
									<div>
										{
											rabbit_array.map(function(item, i){
												if(i%2===0){
													var rabbit01 = rabbit_array[i];
													var rabbit02 = rabbit_array[i+1];
													var rabbit_box_nr01 = "rabbit_box_nr shadow_convex " + rabbit01.color;
													var rabbit_box_nr02 = "rabbit_box_nr shadow_convex " + rabbit02.color;
													return(
														<div className="rabbit_box_container" key={i}>
															<div className="rabbit_box">
																<div className="rabbit_box_info">
																	<div className="rabbit_box_name shadow_convex"><p>{rabbit01.name}</p></div>
																	<div className={rabbit_box_nr01}><p>{rabbit01.id}</p></div>
																	<img className="shadow_convex" src={rabbit_img} alt="rabbit_img" />
																</div>
																<div className="rabbit_box_input">
																	{self.state.lang === "ro" ? <p>Pariaza:</p> : <p>Bet:</p>}
																	<div>
																		<span className="rabbit_box_minus">-</span>
																		<input className="race_input" readOnly value="0" type="text"></input>
																		<span className="rabbit_box_plus">+</span>
																	</div>
																</div>																													
															</div>
															<div className="rabbit_box">
																<div className="rabbit_box_info">
																	<div className="rabbit_box_name shadow_convex"><p>{rabbit02.name}</p></div>
																	<div className={rabbit_box_nr02}><p>{rabbit02.id}</p></div>
																	<img className="shadow_convex" src={rabbit_img} alt="rabbit_img" />
																</div>
																<div className="rabbit_box_input">
																	{self.state.lang === "ro" ? <p>Pariaza:</p> : <p>Bet:</p>}
																	<div>
																		<span className="rabbit_box_minus">-</span>
																		<input className="race_input" readOnly value="0" type="text"></input>
																		<span className="rabbit_box_plus">+</span>
																	</div>
																</div>																													
															</div>																													
														</div>
													)
												}
											})
										}
									</div>
								</div>
							</div>
						</Col>
					</Row>
					<Row>				
						<Col sm={12} className="race_bets_container">
							<div className="race_clear_bets shadow_convex" id="race_clear_bets">Clear Bets</div>
							<div className="race_buttons_box">
								{self.state.lang === "ro" ? 
									<p className="slot_buttons_box_cell slot_buttons_box_text">Ai: <span>{self.state.money} morcovi</span></p> : 
									<p className="slot_buttons_box_cell slot_buttons_box_text">You have: <span>{self.state.money} carrots</span></p>
								}
							</div>
							<div className="race_buttons_box">
								<div className="race_start shadow_convex" id="race_start">START</div>
							</div>
						</Col>
					</Row>
				</Col>
				<Col sm={2}></Col>
			</Row>
		</>
	)
}

var self; 
class Race extends Component {	
	constructor(props) {
		super(props);
		self = this;
		self.state = {
			socket: props.socket,
			lang: props.lang,
			rabbit_array: [],
			ready: false,
			start_race: false,
			user: props.user,
			id: -1,
			money: 0,
	  	};
	}

	componentDidMount() {
		$('.full-height').attr('id', 'race')		
		var id = parseInt(self.getCookie("casino_id"));
		if(id === "" || id === "indefined"){
			id = -1;
		}

		var payload = {id: id, user: this.state.user}
		self.state.socket.emit('race_send', payload);
		self.state.socket.on('race_read', function(data){	
		 	self.setState({ rabbit_array: data.rabbit_race })
			self.setState({ money: data.money })
			self.setState({ id: data.id })
		 	self.setState({ ready: true })
		});
	}

	getCookie = function (cname) {
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for(var i = 0; i < ca.length; i++) {
		  	var c = ca[i];
		  	while (c.charAt(0) === ' ') {
				c = c.substring(1);
		  	}
		  	if (c.indexOf(name) === 0) {
				return c.substring(name.length, c.length);
		  	}
		}
		return "";
	} 
	
	get_data = function(x){
		if(x === "tables"){
			self.setState({ start_race: true })
		}
	}

	render() {
		return (
			<>
				{(() => {
					if (self.state.ready) {
						if (self.state.start_race) {
							return <RaceGame data={self.state}></RaceGame>
						} else {
							return <RaceTables data={self.state} get_data={self.get_data}></RaceTables>
						}						
					} else {
						return (
							<div>Loading...</div>
						)
					}
				})()}
			</>
	  	)
	}
}

export default Race;