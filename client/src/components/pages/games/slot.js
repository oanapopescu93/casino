import React from 'react';
import $ from 'jquery'; 
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import {connect} from 'react-redux'
import item01 from '../../img/slot_imgs/energy.png';
import item02 from '../../img/slot_imgs/staff.png';
import item03 from '../../img/slot_imgs/cash.png';
import item04 from '../../img/slot_imgs/build.png';
import item05 from '../../img/slot_imgs/goods.png';
import item06 from '../../img/slot_imgs/gold.png';

var canvas_width = 200;
var canvas_height = 800;
var font_bold_10 = 'bold 10px sans-serif';
var font_bold_12 = 'bold 12px sans-serif';
var font_bold_14 = 'bold 14px sans-serif';
var font_bold_16 = 'bold 16px sans-serif';

var items = [{id: 'energy', src: item01},{id: 'staff', src: item02},{id: 'cash', src: item03},{id: 'build', src: item04},{id: 'goods', src: item05},{id: 'gold', src: item06}];
var slots_canvas = [];
var slots_ctx = [];
var runtime = 3000; // how long all slots spin before starting countdown
var spintime = 1000; // how long each slot spins at minimum
var slot_speed = 15; // how many pixels per second slots roll

var my_slot;

var ctx;
var socket;

function slot_game(props){
	console.log(props)
	var self = this;
	this.reel = [$('#slot_canvas1'), $('#slot_canvas2'), $('#slot_canvas3'), $('#slot_canvas4'), $('#slot_canvas5')];
		
	this.ready = function(){
		if (window.innerWidth < 960){
			font_bold_10 = 'bold 8px sans-serif';
			font_bold_12 = 'bold 10px sans-serif';
			font_bold_14 = 'bold 12px sans-serif';
			font_bold_16 = 'bold 12px sans-serif';			
		} else {			
			font_bold_10 = 'bold 10px sans-serif';
			font_bold_12 = 'bold 12px sans-serif';
			font_bold_14 = 'bold 14px sans-serif';
			font_bold_16 = 'bold 16px sans-serif';			
		}

		var promises = [];
		for(var i in items){
			promises.push(self.preaload_images(items[i]));
		}

		Promise.all(promises).then(function(result){
			for(var i in self.reel){
				result = shuffleArray(result)
				slots_canvas.push(self.reel[i][0]);
				self.createCanvas(slots_canvas[slots_canvas.length-1]);
				self.draw_reel(slots_canvas[slots_canvas.length-1], result);
			}
		});

		$('#slot_spin').click(function(e) {
			self.spin();
		});
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
	
	this.createCanvas = function(canvas){
		ctx = canvas.getContext("2d");
		slots_ctx.push(ctx)	
		if (window.innerWidth < 960){
			canvas.width = 50;
			canvas.height = 300;		
		} else {
			canvas.width = 100;	
			canvas.height = 800;	
		}		
		canvas_width = canvas.width;
		canvas_height = canvas.height;		
		canvas.height = canvas_height;
    }

	this.draw_reel = function(canvas, assets){
		ctx.fillStyle = '#ddd';
		for (var i = 0 ; i < items.length ; i++) {
			var asset = items[i];
			ctx.save();
			ctx.shadowColor = "rgba(0,0,0,0.5)";
			ctx.shadowOffsetX = 5;
			ctx.shadowOffsetY = 5;
			ctx.shadowBlur = 5;
			ctx.drawImage(assets[i], 20, i * canvas.width + 15);
			ctx.drawImage(assets[i], 20, (i + items.length) * canvas.width + 15);
			ctx.restore();
			ctx.fillRect(0, i * canvas.width, canvas.width, 2);
			ctx.fillRect(0, (i + items.length)  * canvas.width, canvas.width, 2);
		}
	}

	this.spin = function(){
		this.speed1 = this.speed2 = this.speed3 = this.speed4 = this.speed5 = slot_speed;
		var spin_nr = 0;		

		window.requestAnimFrame = (function(){
			return  window.requestAnimationFrame       ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			function( callback ){
			  window.setTimeout(callback, 1000 / 60);
			};
	  	})();
	  
	  	function loop() {
			var stop = false;
			console.log('SPIN', slots_canvas, slots_ctx);

			if(!stop){
				window.requestAnimFrame(loop);
			} else {
				window.cancelAnimationFrame(loop);
			}
		}

	  	loop();
	}
}

function show_results(message){
	$('.show_results_container').show();
	$('.show_results p').text(message);
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
		var j = parseInt(Math.random() * i)
		var tmp = array[i];
		array[i] = array[j]
		array[j] = tmp;
    }
	return array;
}

function Slot(props) {	
	setTimeout(function(){ 
		$('.full-height').attr('id', 'slots')		
		my_slot = new slot_game(props);
		my_slot.ready();

		$('.show_results_container').click(function () {
			$(this).hide();
		});
		
		$(window).resize(function(){
			my_slot.ready();	
		});
	}, 0);
	
	socket = props.socket;
	
	return (
		<>
			<div className="slot_header_container">
				<div className="slot_header">
					<h1>Slots Machine</h1>
					<h3>Play and Win</h3>
				</div>
			</div>
			<div className="slot_machine_container">
				<div className="slot_machine">
					<div className="box">
						<canvas id="slot_canvas1"></canvas>
						<canvas id="slot_canvas2"></canvas>
						<canvas id="slot_canvas3"></canvas>
						<canvas id="slot_canvas4"></canvas>
						<canvas id="slot_canvas5"></canvas>
					</div>
				</div>
			</div>
			<div className="slot_buttons_container">
				<div className="slot_buttons">
					<Row>
						<Col sm={5}>
							<p>Carrots</p>
							<input className="slot_input" type="number" id="slot_balance" min="1" defaultValue="1" max="5000"></input>
						</Col>
						<Col sm={5}>
							<p>BET</p>
							<input className="slot_input" type="number" id="slot_bet" min="1" defaultValue="1" max="3"></input>
						</Col>
						<Col sm={2} className="slot_spin_container">
							<button className="slot_spin shadow_convex" id="slot_spin">SPIN</button>
						</Col>
					</Row>
				</div>
			</div>
			<div className="show_results_container">
				<div className="show_results">
					<h1>Results</h1>
					<p></p>
				</div>
			</div>	
		</>
	);
}

function mapStateToProps(state) {	
	return { ...state }
}

export default connect(mapStateToProps)(Slot)