import React, { Component } from 'react';
import $ from 'jquery'; 
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {connect} from 'react-redux'
import rabbit_img from "../../img/race_imgs/rabbit.jpg"

var canvas;
var ctx;
var canvas_width = 900;
var canvas_height = 800;
var my_race;
var font_title = 'bold 30px sans-serif';
var rabbit_array = [];
var landscape = [];
var land_color = [['rgba(255, 215, 0, 0.2)', 'gold', 1], ['rgba(255, 215, 0, 0.2)', 'gold', 1], ['rgba(255, 215, 0, 0.2)', 'gold', 1]]
var offset_lanscape = 100;

function Land(config) {
	var self = this;
    self.layer = config.layer;
    self.x = config.x;
    self.y = config.y;
    self.width = config.width;
    self.height = config.height;
};

function Landscape(config){
	var self = this;
	self.x = 0;
    self.lands = [];
	self.layer = config.layer;
	self.width = {
		min: config.width.min,
    	max: config.width.max
	}
	self.height = {
		min: config.height.min,
    	max: config.height.max
	}  
	self.speed = config.speed;
	self.color = config.color;
	self.color_stroke = config.color_stroke;
	self.stroke = config.stroke;
	self.populate = function (){
		var totalWidth = 0;
		var x = 0;
		while (totalWidth <= canvas.width + (10 * self.width.max)) {
			var newWidth = Math.floor(Math.random() * self.width.max) + self.width.min;
			var newHeight = Math.floor(Math.random() * self.height.max) + self.height.min;
			if(self.lands.length !== 0){
				x = self.lands[self.lands.length - 1].x + self.lands[self.lands.length - 1].width;
			}

			self.lands.push(new Land({
				layer: self.layer,
				width: newWidth,
				height: newHeight,
				color: self.color,
				color_stroke: self.color_stroke,
				stroke: self.stroke,
				x: x,
        		y: 500 - newHeight,
			}));

			totalWidth = totalWidth + newWidth;
		}
	}
	self.draw = function(){
		ctx.save();
		ctx.translate(self.x, canvas.height/ offset_lanscape * self.layer);
		ctx.beginPath();
		var lands = self.lands;
		ctx.moveTo(self.lands[0].x, self.lands[0].y);
		
		for(var i=0; i<lands.length-1; i++){
			var point01 = (self.lands[i].x + self.lands[i + 1].x) / 2;
			var point02 = (self.lands[i].y + self.lands[i + 1].y) / 2;
			ctx.quadraticCurveTo(self.lands[i].x, self.lands[i].y, point01, point02);
		}
		ctx.lineTo(canvas.width - self.x, canvas.height);
    	ctx.lineTo(0 - self.x, canvas.height);

		ctx.fillStyle = self.color;
		ctx.lineWidth = self.stroke;
		ctx.strokeStyle = self.color_stroke;
		ctx.fill();
		ctx.stroke();
	}
}

function race_game(props){
	var self = this;
		
	this.ready = function(){
		self.createCanvas(canvas_width, canvas_height);	
		self.start();
	}

	this.start = function(){
		self.background();
		self.add_title();
	}

	this.add_title = function(){
		ctx.font = font_title;
		ctx.fillStyle = "gold";
		ctx.textAlign = "center";
		ctx.fillText("Rabbit Race", canvas.width/2,  20);
	}

	this.background = function(){
		self.create_background();	
		self.draw_background();	
	}

	this.create_background = function(){
		var i = land_color.length;
		while(i--){
			var config = {
				layer: i,
				width: {
					min: (i + 1) * 50,
					max: (i + 1) * 70
				},
				height: {
					min: 200 - (i * 40),
					max: 300 - (i * 40)
				},
				speed: (i + 1) * 0.003,
				color: land_color[i][0],
				color_stroke: land_color[i][1],
				stroke: land_color[i][2]
			}
			var my_land = new Landscape(config)
			my_land.populate();
			landscape.push(my_land)
		}		
	}

	this.draw_background = function(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		self.draw_sun();
		var i = landscape.length;
		while (i--) {
			landscape[i].draw();
		}
	}

	this.draw_sun = function(){
		draw_dot(canvas.width-50, 50, 40, 0, 2 * Math.PI, false, 'rgba(255, 255, 0, 0.2)', 1, 'gold');
	}

	this.createCanvas = function(canvas_width, canvas_height){		
		canvas = document.getElementById("race_canvas");		
		ctx = canvas.getContext("2d");
		
		if (window.innerWidth < 960){
			if(window.innerHeight < window.innerWidth){
				//small landscape				
				canvas.width = 300;
				canvas.height = 300;
				offset_lanscape = 50;				
			} else {
				//small portrait
				canvas.width = 400;
				canvas.height = 400;
				offset_lanscape = 50;	
			}
			font_title = 'bold 20px sans-serif';
		} else {
			//big
			canvas.width = 900;
			canvas.height = 800;
			font_title = 'bold 30px sans-serif';
			offset_lanscape = 100;	
			if (window.innerWidth >= 1200){
				canvas.width = 1000;
			} 
			if (window.innerWidth >= 1400){
				canvas.width = 1200;
			} 
		}
		
		canvas_width = canvas.width;
		canvas_height = canvas.height;		
		canvas.height = canvas_height;
	}
}

function draw_dot(x, y, r,sAngle,eAngle,counterclockwise, fillStyle, lineWidth, strokeStyle){
	ctx.beginPath();
	ctx.arc(x, y, r, sAngle, eAngle, counterclockwise);
	ctx.fillStyle = fillStyle;
	if(strokeStyle !== ""){
		ctx.lineWidth = lineWidth;
		ctx.strokeStyle = strokeStyle;
		ctx.stroke();
	}		
	ctx.fill();
	ctx.closePath();
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

function mapStateToProps(state) {	
	return { ...state }
}

export default connect(mapStateToProps)(Race)