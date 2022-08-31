import React, {useEffect, useState} from 'react';
import $ from 'jquery';
import { bigText, get_keno_images, showResults } from '../../utils';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

let my_keno;
let my_keno_circle;
let kenoSpotArraySelected = [];

function kenoSpot(config){
	let self = this;
	self.id = config.id;	
	self.i = config.i;
	self.j = config.j;	
	self.space = 5;
	self.w = config.w - self.space;
	self.h = config.h - self.space;
	self.x = config.j * config.w;
	self.y = config.i * config.h;

	self.color = config.color;
	self.border = config.border;
	self.border_color = config.border_color;
	self.font = config.font;

	self.img = config.img;
	self.status = config.status;
	self.selected = config.selected;
	let image_sise = 245;

	self.draw = function(ctx){
		ctx.clearRect(self.x-1, self.y-1, self.w+2, self.h+2);
		ctx.drawImage(self.img, 0, 0, image_sise, image_sise, self.x, self.y, self.w, self.h);
		if(self.selected){
			ctx.beginPath();
			ctx.rect(self.x, self.y, self.w, self.h);
			ctx.fillStyle = self.color;
			if(self.border){
				ctx.lineWidth = self.border;
				ctx.strokeStyle = self.border_color;
				ctx.stroke();
			}		
			ctx.fill();
		}
		ctx.beginPath();
		ctx.textAlign="center"; 
		ctx.textBaseline = "middle";
		ctx.fillStyle = self.border_color;
		ctx.font = self.font;
		ctx.fillText(self.id, self.x + (config.w / 2), self.y + (config.h / 2));
	}

	self.changeStatus = function(new_status){
		self.status = new_status;
	}

	self.changeSelection = function(){
		if(self.selected){
			self.selected = false;
		} else {
			self.selected = true;
		}
	}
}

function keno_game(props){
	let self = this;
	let canvas, ctx;
	let canvas_width = 900;
	let canvas_height = 800;
	let font = 'bold 14px sans-serif';
	let kenoSpotArray = [];		
	let how_many_rows = 10;
	let how_many_columns = 8;
	this.images = [];
	let items = get_keno_images();
	let reason = "";
	
	this.ready = function(r){
		reason = r;
		self.createCanvas(canvas_width, canvas_height);
		if(reason !== "resize"){
			let promises = [];
			for(let i in items){				
				promises.push(self.preaload_images(items[i]));
			}

			Promise.all(promises).then(function(result){
				self.images = result;
				self.KenoBoardCreate();
				self.KenoBoardDraw();
				self.KenoBoardClick();
			});
		} else {
			self.KenoBoardCreate();
			self.KenoBoardDraw();
			self.KenoBoardClick();
		}
	}	
	
	this.createCanvas = function(canvas_width, canvas_height){		
		canvas = document.getElementById("keno_canvas");	
		ctx = canvas.getContext("2d");
		
		if (window.innerWidth < 960){
			if(window.innerHeight < window.innerWidth){
				//small landscape				
				canvas.width = 260;
				canvas.height = 300;
			} else {
				//small portrait
				canvas.width = 290;
				canvas.height = 400;
			}
			font = 'bold 12px sans-serif';
			
		} else {
			//big
			canvas.width = 900;
			canvas.height = 500;
			font = 'bold 14px sans-serif';
		}
		
		canvas_width = canvas.width;
		canvas_height = canvas.height;		
		canvas.height = canvas_height;
	}

	this.preaload_images = function(item){
		return new Promise(function(resolve, reject){
			let image = new Image();
			image.id = item.id;
			image.src = item.src;
			image.addEventListener("load", function() {
				resolve(image)
			}, false);
		});
	}

	this.KenoBoardCreate = function(){
		let kenoSpotArray_new = [];
		let number = 0;		
		for(let i=0; i < how_many_columns; i++){
			for(let j=0; j < how_many_rows; j++){
				number++
				let config = {
					id: number,
					i: i,
					j: j,
					w: canvas.width / how_many_rows,
					h: canvas.height / how_many_columns,
					color: 'rgba(255, 255, 0, 0.1)',
					border: 1,
					border_color: '#ffd700',
					font: font,
					img: self.images[0],
					status: "earth",
					selected: false,
				}

				if(kenoSpotArraySelected[number-1]){
					config.selected = kenoSpotArraySelected[number-1].selected
				}
				
				let box = new kenoSpot(config);
				kenoSpotArray_new.push(box);				
			}
		}
		kenoSpotArray = kenoSpotArray_new;
	}

	this.KenoBoardDraw = function(){
		ctx.clearRect(0,0, canvas_width, canvas_height);
		for(let i in kenoSpotArray){
			kenoSpotArray[i].draw(ctx);
		}
	}	

	this.KenoBoardClick = function(){
		$('#keno_canvas').off('click').on('click', function(event) {
			self.handleClick(event);
		});
	}

	this.handleClick = function(event){	
		let mousePos = getMousePos(canvas, event);
		for(let i in kenoSpotArray){
			if (isInside(mousePos, kenoSpotArray[i])) {
				kenoSpotArray[i].changeSelection();
				kenoSpotArray[i].draw(ctx);
				if(kenoSpotArray[i].selected){
					kenoSpotArraySelected.push(kenoSpotArray[i]);
				} else {
					for(let j = 0; j < kenoSpotArraySelected.length; j++){                                   
						if (kenoSpotArraySelected[j].id === kenoSpotArray[i].id) { 
							kenoSpotArraySelected.splice(j, 1); 
							j--; 
						}
					}
				}
				break;
			} 
		}
		self.showSelected();
	}

	this.handleclear = function(){
		kenoSpotArraySelected = []
		self.KenoBoardCreate();
		self.KenoBoardDraw();
		self.KenoBoardClick();
	}

	this.showSelected = function(){
		if($("#keno_your_selected") !== null){
			$("#keno_your_selected").empty();
			for(let i in kenoSpotArraySelected){
				let comma = ', ';
				if(parseInt(i) === kenoSpotArraySelected.length-1){
					comma = '';
				}
				$("#keno_your_selected").append('<span class="keno_box">' + kenoSpotArraySelected[i].id + comma + '</span>');
			}
		}
	}

	function getMousePos(canvas, event) {
		let rect = canvas.getBoundingClientRect();
		return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		};
	}	
	function isInside(mousePos, obj){
		return mousePos.x > obj.x && mousePos.x < obj.x + obj.w && mousePos.y < obj.y + obj.h && mousePos.y > obj.y
	}
}

function keno_game_circle(props){
	let self = this;
	let canvas, ctx;
	let canvas_width = 300;
	let canvas_height = 300;
	let reason = "";
	let lang = props.lang;
	
	this.ready = function(r){
		reason = r;
		self.createCanvas(canvas_width, canvas_height);
		if(reason !== "resize"){
			self.drawBigCircle();
			self.createBalls();
			self.drawBalls();
		} else {
			self.drawBigCircle();
			self.createBalls();
			self.drawBalls();
		}
	}	
	
	this.createCanvas = function(canvas_width, canvas_height){		
		canvas = document.getElementById("keno_canvas_circle");	
		ctx = canvas.getContext("2d");
		
		if (window.innerWidth < 960){
			if(window.innerHeight < window.innerWidth){
				//small landscape				
				canvas.width = 101;
				canvas.height = 101;
			} else {
				//small portrait
				canvas.width = 102;
				canvas.height = 102;
			}			
		} else if (window.innerWidth < 1200){
			//big
			canvas.width = 300;
			canvas.height = 300;			
		} else {
			//big
			canvas.width = 500;
			canvas.height = 500;	
		}
		
		canvas_width = canvas.width;
		canvas_height = canvas.height;		
		canvas.height = canvas_height;
	}

	this.drawBigCircle = function(){
		let centerX = canvas.width / 2 - 1;
		let centerY = canvas.height / 2 - 1;
		let radiusBig = canvas.width / 2 - 1;
		draw_dot(centerX, centerY, radiusBig, 0, 2 * Math.PI, false, 'rgba(255, 255, 0, 0.1)', 1, '#ffd700');
	}

	this.createBalls = function(){
		
	}

	this.drawBalls = function(){
		
	}

	this.start = function(){		
		if(kenoSpotArraySelected && kenoSpotArraySelected.length>0){
			self.spin();
		} else {
			if(lang === "ro"){
				showResults("", "Please place your bet before playing.");	
			} else {
				showResults("", "Please place your bet before playing.");	
			}
		}
	}

	this.spin = function(){
		console.log('SPIN', kenoSpotArraySelected)
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
}

function Keno(props){
	let lang = props.lang;
	const [title, setTitle] = useState("");

	useEffect(() => {
		if (window.innerWidth >= 960){
			setTitle("Keno");		
		} else {
			setTitle("");
		}
		
		my_keno = new keno_game(props);
		my_keno.ready();
		my_keno_circle = new keno_game_circle(props);
		my_keno_circle.ready();

		$(window).resize(function(){
			if (window.innerWidth >= 960){
				setTitle("Keno");		
			} else {
				setTitle("");
			}
			if(document.getElementById("keno_canvas") !== null){
				my_keno.ready('resize');
			}
			if(document.getElementById("keno_canvas_circle") !== null){
				my_keno_circle.ready('resize');
			}
		});
	}, []); 

	function game_keno_rules(){
		if(lang === "ro"){
			let pay_table = `
			<div id="keno_rules" class="keno_rules">
				<p>Da click pe casutele Keno si alege pana la 10 casute sau alege Quick Pick (va alege 10 casute aleator).</p>
			</div>`;
			let text = bigText("craps_rules", lang, pay_table);
			showResults("Reguli", text, 400);
		} else {
			let pay_table = `
			<div id="keno_rules" class="keno_rules">
				<p>Pick up to 10 Keno spots or choose Quik Pik (defaults to 10 numbers) by clicking on the number in the Keno card.</p>
			</div>`;
			let text = bigText("craps_rules", lang, pay_table);
			showResults("Rules", text, 400);
		}
	}

	function game_keno_start(){
		if(my_keno_circle){
			my_keno_circle.start();
		}
	}
	function game_keno_clear(){
		if(my_keno){
			my_keno.handleclear();
		}
	}

	return (
		<div className="keno_container">
			<h1 className="keno_title">{title}</h1>
			<p>Under construction</p>
			
			<Row>
				<Col sm={12}><div id="keno_your_selected"></div></Col>
			</Row>	
			<Row>
				<Col sm={4} className="keno_canvas_circle_container"><canvas id="keno_canvas_circle"></canvas></Col>
				<Col sm={8} className="keno_canvas_container"><canvas id="keno_canvas"></canvas></Col>
			</Row>
			<div id="keno_start" onClick={()=>{game_keno_start()}}>Start</div>		
			<div id="keno_start" onClick={()=>{game_keno_clear()}}>Clear</div>		
			
			{lang === "ro" ? 
				<p id="keno_rules_button" onClick={()=>{game_keno_rules()}}>Click aici pentru a vedea regulile</p> : 
				<p id="keno_rules_button" onClick={()=>{game_keno_rules()}}>Click here to see rules</p>}
		</div>
	)
}

export default Keno;