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
var prize = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129]
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
	this.images_set = [];
    this.offset = [];
		
	this.ready = function(reason){
		if (window.innerWidth < 768){
			image_size = [50, 50];
			slot_speed = 5;
			font_bold_10 = 'bold 8px sans-serif';
			font_bold_12 = 'bold 10px sans-serif';
			font_bold_14 = 'bold 12px sans-serif';
			font_bold_16 = 'bold 12px sans-serif';				
		} else {
			image_size = [100, 100];
			slot_speed = 10;			
			font_bold_10 = 'bold 10px sans-serif';
			font_bold_12 = 'bold 12px sans-serif';
			font_bold_14 = 'bold 14px sans-serif';
			font_bold_16 = 'bold 16px sans-serif';			
		}

		if(reason != "resize"){
			var promises = [];
			for(var i in items){
				promises.push(self.preaload_images(items[i]));
			}

			Promise.all(promises).then(function(result){
				self.images = result;	
				slots_canvas = [];		
				for(var i in self.reel){				
					self.images = shuffleArray(self.images, reason)
					self.offset.push(0);
					slots_canvas.push(self.reel[i][0]);
					self.createCanvas(slots_canvas[slots_canvas.length-1]);					
					self.draw_reel(slots_canvas[slots_canvas.length-1], self.images, reason);
				}
			});	
		} else {
			slots_canvas = [];
			console.log(self.images_pos)
			for(var i in self.reel){
				slots_canvas.push(self.reel[i][0]);
				self.createCanvas(slots_canvas[slots_canvas.length-1]);
				self.draw_reel(slots_canvas[slots_canvas.length-1], self.images_pos[i], reason);
			}
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
	
	this.createCanvas = function(canvas){
		ctx = canvas.getContext("2d");
		slots_ctx.push(ctx)	
		
		canvas.width = image_size[0];
		canvas.height = 2 * items.length * image_size[1];

		canvas_width = canvas.width;
		canvas_height = canvas.height;		
		canvas.height = canvas_height;
    }

	this.draw_reel = function(canvas, assets, reason){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = '#ddd';
		var array = [];

		for (var i = 0 ; i < items.length ; i++) {
			var img = assets[i];
			if(reason === "resize"){
				img = assets[i].img;
			}	
			ctx.fillRect(0, i * canvas.width, canvas.width, 2);
			ctx.fillRect(0, (i + items.length)  * canvas.width, canvas.width, 2);
			ctx.drawImage(img, 0, 0, image_size[0], image_size[1], 0, i*image_size[1], image_size[0], image_size[1]);
			ctx.drawImage(img, 0, 0, image_size[0], image_size[1], 0, (i + items.length) * canvas.width, image_size[0], image_size[1]);

			var elem = {i:i, img:img, pos:i * canvas.width}
			array.push(elem)	
			var elem = {i:i + items.length, img:img, pos:(i + items.length) * canvas.width}
			array.push(elem)		
		}

		// img - Specifies the image, canvas, or video element to use	 
		// sx - Optional. The x coordinate where to start clipping	
		// sy - Optional. The y coordinate where to start clipping	
		// swidth - Optional. The width of the clipped image	
		// sheight - Optional. The height of the clipped image	
		// x - The x coordinate where to place the image on the canvas	
		// y - The y coordinate where to place the image on the canvas	
		// width - Optional. The width of the image to use (stretch or reduce the image)	
		// height - Optional. The height of the image to use (stretch or reduce the image)

		array = sort_array(array, "i");
		if(reason != "resize"){
			self.images_pos.push(array)
		}		
	}

	this.rotate = function(i){
		self.offset[i] = self.offset[i] - slot_speed;
		var max_height = -(self.reel[i][0].height - items.length * image_size[1])
		if(self.offset[i] < max_height){
			self.offset[i] = 0;
		}
		self.reel[i].css('transform', 'translate(0px, '+self.offset[i]+'px)')
	}

	$('body').off('click', '#slot_spin').on('click', '#slot_spin', function () {
		dispatch_nr = 0;
		self.spin(spin_time, slot_speed);
	})

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
					self.rotate(i);
				}
			} else {
				stop = true;
				for(var i in self.reel){
					if(self.offset[i]%100 !== 0){
						stop = false;
						self.rotate(i);
					}
				}
			}
			

			if(!stop){
				window.requestAnimFrame(spin_slot);
			} else {
				window.cancelAnimationFrame(spin_slot);
				self.win_lose(self.get_results_pos());				
			}
		}

		if(dispatch_nr === 1){
			spin_slot();
		}	
	}

	this.win_lose = function(results){
		console.log('res--> ', results);
		var win = [];
		for(var i=0; i<30; i++){
			win.push(self.check_win(i, results));
		}
		console.log('win--> ', win);
	}

	this.check_win = function(x, results){
		var same = false;	
		var matrix = [];
		var t = 0;	
		var k = 0;
		var my_prize = prize[x];

		switch (x) {
			case 0:
			case 1:
			case 2:				
				for(var i=0; i<results.length; i++){
					matrix.push([x, i]);
				}
				break; 
			case 3:	
			case 4:				
				for(var i=0; i<results.length; i++){
					if(i === 2){
						t  = Math.round((results[0].length-1) / 2);
					} else {
						if(x===3){
							if(i===3 || i===4){
								t = results[0].length-1;
							}
						} else {
							t=results[0].length-1;
							if(i === 3 || i === 4){
								t=0;
							}
						}
					}					
					
					matrix.push([t, i]);
				}
				break; 	
			case 5:	
			case 6:				
				for(var i=0; i<results.length; i++){
					t = 0
					if(x === 5){
						if(i%2 !== 0){
							t = results[0].length-1;
						}
					} else {
						if(i%2 === 0){
							t = results[0].length-1;
						}
					}
					matrix.push([t, i]);
				}
				break; 
			case 7:	
			case 8:				
				for(var i=0; i<results.length; i++){
					t = 0
					if(x === 7){
						if(i%2 !== 0){
							t  = Math.round((results[0].length-1) / 2);
						}
					} else {
						if(i%2 === 0){
							t  = Math.round((results[0].length-1) / 2);
						}
					}
					matrix.push([t, i]);
				}
				break; 	
		} 

		for(var i=1; i<results.length; i++){
		// 	if(results[0][0].img.id === results[i][x].img.id){
		// 		k++
		// 	}
		}
		if(k === results.length){
		 	same = true;
		}
		console.log(x, matrix)
		return {payable: x, win:same, prize:prize};
	}

	this.get_results_pos = function(){
		var results = [];
		for(var i in self.reel){
			for(var j in self.images_pos[i]){
				if(self.images_pos[i][j].pos === -self.offset[i]){
					var k = j-1;
					var result = [];
					for(var t=0; t<3; t++){	
						k++;
						if(k > self.images_pos[i].length-1 ){
							k = 0;
						}
						result.push(self.images_pos[i][k]);	
					}
					results.push(result);
				}
			}
		}
		return results;
	}
}

function show_results(message){
	$('.show_results_container').show();
	$('.show_results p').text(message);
	$('body').off('click', '.show_results_container').on('click', '.show_results_container', function () {
		$(this).hide();
	});
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
		$(window).resize(function(){
			my_slot.ready("resize");	
		});
	}, 0);
	
	socket = props.socket;
	var lang = props.lang;
	var money = props.money;	
	return (
		<>
			<p>Still under construction.</p>
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
					</div>
					<div className="box">
						<canvas id="slot_canvas2"></canvas>
					</div>
					<div className="box">
						<canvas id="slot_canvas3"></canvas>
					</div>
					<div className="box">
						<canvas id="slot_canvas4"></canvas>
					</div>
					<div className="box">
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