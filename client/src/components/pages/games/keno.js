import React, {useEffect, useState, useRef} from 'react';
import $ from 'jquery';
import { useDispatch } from 'react-redux'
import { bigText, showResults } from '../../utils';

function kenoSpot(config){
	let self = this;
	self.id = config.id;	
	self.i = config.i;
	self.j = config.j;	
	self.space = 5;
	self.w = config.w - self.space;
	self.h = config.h - self.space;
	self.color = config.color;
	self.border = config.border;
	self.border_color = config.border_color;
	self.font = config.font;
	

	self.x = config.j * config.w;
	self.y = config.i * config.h;

	self.draw = function(ctx){
		ctx.beginPath();
		ctx.rect(self.x, self.y, self.w, self.h);
		ctx.fillStyle = self.color;
		if(self.border){
			ctx.lineWidth = self.border;
			ctx.strokeStyle = self.border_color;
			ctx.stroke();
		}		
		ctx.fill();
		ctx.textAlign="center"; 
		ctx.textBaseline = "middle";
		ctx.fillStyle = self.border_color;
		ctx.font = self.font;
		ctx.fillText(self.id, self.x + (config.w / 2), self.y + (config.h / 2));
	}
}

function roulette_game(props){
	let self = this;
	let lang = props.lang;
	let socket = props.socket;
	const dispatch = props.dispatch;
	let canvas, ctx;
	let canvas_width = 900;
	let canvas_height = 800;
	let font = 'bold 14px sans-serif';
	let kenoSpotArray = [];
	let how_many_rows = 10;
	let how_many_columns = 8;
	
	this.ready = function(){
		self.createCanvas(canvas_width, canvas_height);
		self.KenoBoardCreate();
		self.KenoBoardDraw();
		self.keno_click();
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

	this.KenoBoardCreate = function(){
		kenoSpotArray = [];
		let number = 0;		
		for(let i=0; i < how_many_columns; i++){
			for(let j=0; j < how_many_rows; j++){
				number++
				let config = {
					id: number,
					i: i,
					j: j,
					w: canvas.width / how_many_rows,
					h:canvas.height / how_many_columns,
					color: 'rgba(255, 255, 0, 0.1)',
					border: 1,
					border_color: '#ffd700',
					font: font,
				}
				let box = new kenoSpot(config);
				kenoSpotArray.push(box);				
			}
		}		
	}

	this.KenoBoardDraw = function(){
		ctx.clearRect(0,0, canvas_width, canvas_height);
		for(let i in kenoSpotArray){
			kenoSpotArray[i].draw(ctx);
		}
	}

	this.keno_click = function(){			
		$('#keno_canvas').off('click').on('click', function(event) {
			let money = props.info.data.money;
			if(money>0){
				self.canvas_click(canvas, event);
			} else {
				if(lang === "ro"){
					showResults("Nu ai suficienti morcovi!", "Du-te in contul tau, la sectiunea Market si cumpara.", 600);
				} else {
					showResults("You don't have enough carrots!", "Go to your account, at the Market Section and buy some.", 600);
				}
			}
		});
	}

	this.canvas_click = function(canvas, event){		
		let mousePos = getMousePos(canvas, event);
		for(let i in kenoSpotArray){
			let obj = kenoSpotArray[i];	
			if (isInside(mousePos,obj)) {
				console.log('CLICK--> ', obj)
				break;
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

		let my_keno = new roulette_game(props);
		my_keno.ready();

		$(window).resize(function(){
			if (window.innerWidth >= 960){
				setTitle("Keno");		
			} else {
				setTitle("");
			}
			if(document.getElementById("keno_canvas") !== null){
				my_keno.ready('resize');
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

	return (
		<>
			<div className="keno_container">
				<h1 className="keno_title">{title}</h1>
				<p>Under construction</p>
				<canvas id="keno_canvas"></canvas>
				{lang === "ro" ? 
					<p id="keno_rules_button" onClick={()=>{game_keno_rules()}}>Click aici pentru a vedea regulile</p> : 
					<p id="keno_rules_button" onClick={()=>{game_keno_rules()}}>Click here to see rules</p>}
			</div>
		</>
	)
}

export default Keno;