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
var image_size = [100, 100]
var spin_time = 300; // how long all slots spin before starting countdown
var slot_speed = 10; // how many pixels per second slots roll
var dispatch_nr = 0; //this prevents multiplication

var my_slot;

var ctx;
var socket;

function slot_game(props){
	var self = this;
	var lang = props.lang;
	this.reel = [$('#slot_canvas1'), $('#slot_canvas2'), $('#slot_canvas3'), $('#slot_canvas4'), $('#slot_canvas5')];
	this.images = [];
	this.images_pos = [];
    this.offset = [];
    this.lastUpdate = new Date();
		
	this.ready = function(){
		if (window.innerWidth < 960){
			font_bold_10 = 'bold 8px sans-serif';
			font_bold_12 = 'bold 10px sans-serif';
			font_bold_14 = 'bold 12px sans-serif';
			font_bold_16 = 'bold 12px sans-serif';
			image_size = [50, 50];			
		} else {			
			font_bold_10 = 'bold 10px sans-serif';
			font_bold_12 = 'bold 12px sans-serif';
			font_bold_14 = 'bold 14px sans-serif';
			font_bold_16 = 'bold 16px sans-serif';	
			image_size = [100, 100];		
		}

		var promises = [];
		for(var i in items){
			promises.push(self.preaload_images(items[i]));
		}

		Promise.all(promises).then(function(result){
			self.images = result;
			for(var i in self.reel){				
				self.images = shuffleArray(self.images)
				self.offset.push(0);
				slots_canvas.push(self.reel[i][0]);
				self.createCanvas(slots_canvas[slots_canvas.length-1]);
				self.draw_reel(slots_canvas[slots_canvas.length-1], self.images);
			}
			console.log(self.images_pos)	
		});

		$('#slot_spin').click(function(e) {
			dispatch_nr = 0;
			self.spin(spin_time, slot_speed);
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
			image_size = [50, 50]		
		} else {
			canvas.width = 100;	
			canvas.height = 1100;
			image_size = [100, 100]	
		}		
		canvas_width = canvas.width;
		canvas_height = canvas.height;		
		canvas.height = canvas_height;
    }

	this.draw_reel = function(canvas, assets){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = '#ddd';
		var array = [];
		for (var i = 0 ; i < items.length ; i++) {
			ctx.fillRect(0, i * canvas.width, canvas.width, 2);
			ctx.fillRect(0, (i + items.length)  * canvas.width, canvas.width, 2);
			ctx.drawImage(assets[i], 20, i * canvas.width + 15);
			ctx.drawImage(assets[i], 20, (i + items.length) * canvas.width + 15);	
			var elem = {i:i, img:assets[i], x:0, y:i * canvas.width}
			array.push(elem)	
			var elem = {i:i + items.length, img:assets[i], x:0, y:(i + items.length) * canvas.width}
			array.push(elem)					
		}
		array = sort_array(array, "i");
		self.images_pos.push(array)
	}

	this.rotate = function(i, spin_nr, spin_time){
		self.offset[i] = self.offset[i] - slot_speed;
		var max_height = -(self.reel[i][0].height - 3*image_size[1])
		if(self.offset[i] < max_height){
			self.offset[i] = 0;
		}
		if(i==0){
			console.log(self.offset[i], max_height, self.offset[i] < max_height, spin_nr, spin_time)
		}
		self.reel[i].css('transform', 'translate(0px, '+self.offset[i]+'px)')
	}

	this.spin = function(spin_time){
		var spin_nr = 0;
		dispatch_nr++		

		window.requestAnimFrame = (function(){
			return  window.requestAnimationFrame       ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			function( callback ){
			  window.setTimeout(callback, 1000 / 60);
			};
	  	})();
	  
	  	function spin_slot() {
			var stop = false;
			
			if(spin_nr < spin_time){
				stop = false;
				spin_nr++;
				for(var i in self.reel){
					self.rotate(i, spin_nr, spin_time);
				}
			} else {
				stop = true;
			}

			if(!stop){
				window.requestAnimFrame(spin_slot);
			} else {
				window.cancelAnimationFrame(spin_slot);
			}
		}

		if(dispatch_nr === 1){
			spin_slot();
		}	
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

function sort_array(list_element, sort_by) {
	if(typeof sort_by == "undefined"){
		sort_by = ""
	}
	switch (sort_by) {
		case "i":
			var done = false;
			while (!done) {
				done = true;
				for (var i = 1; i < list_element.length; i += 1) {
					if (list_element[i - 1].i > list_element[i].i) {
						done = false;
						var tmp = list_element[i - 1];
						list_element[i - 1] = list_element[i];
						list_element[i] = tmp;
					} 
				}
			}
		  break;            
		  case "":
			var done = false;
			while (!done) {
				done = true;
				for (var i = 1; i < list_element.length; i += 1) {
					if (parseFloat(list_element[i - 1]) > parseFloat(list_element[i])) {
						done = false;
						var tmp = list_element[i - 1];
						list_element[i - 1] = list_element[i];
						list_element[i] = tmp;
					}
				}
			}                
		  break;            
	  }        
  
	return list_element;
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
	var lang = props.lang;
	var money = props.money;	
	return (
		<>
			<div className="slot_header_container">
				<div className="slot_header">
					{lang === "ro" ? <h1>Pacanele</h1> : <h1>Slots Machine</h1>}	
					{lang === "ro" ? <h3>Joaca si castiga</h3> : <h3>Play and Win</h3>}
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
							<input className="slot_input" type="number" id="slot_balance" min="1" defaultValue={money} max="5000"></input>
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
					<h1>{lang === "ro" ? <span>Rezultate</span> : <span>Results</span>}</h1>
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