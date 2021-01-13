import React from 'react';
import $ from 'jquery'; 
import Button from 'react-bootstrap/Button'

import {useDispatch, useSelector, connect} from 'react-redux'

var canvas;
var ctx;
var socket;
var my_slot;
var canvas_width = 900;
var canvas_height = 800;

var font_bold_10 = 'bold 10px sans-serif';
var font_bold_12 = 'bold 12px sans-serif';
var font_bold_14 = 'bold 14px sans-serif';
var font_bold_16 = 'bold 16px sans-serif';

function slot_game(props){
	var self = this;
		
	this.ready = function(){
		self.createCanvas(canvas_width, canvas_height);
	}
	
	this.createCanvas = function(canvas_width, canvas_height){		
		canvas = document.getElementById("slot_canvas");		
		ctx = canvas.getContext("2d");	
		
		if (window.innerWidth < 900){
			canvas.width = window.innerWidth - 30;
			canvas.height = 300;			
			
			font_bold_10 = 'bold 8px sans-serif';
			font_bold_12 = 'bold 10px sans-serif';
			font_bold_14 = 'bold 12px sans-serif';
			font_bold_16 = 'bold 12px sans-serif';			
		} else {
			canvas.width = 900;	
			canvas.height = 800;
			
			font_bold_10 = 'bold 10px sans-serif';
			font_bold_12 = 'bold 12px sans-serif';
			font_bold_14 = 'bold 14px sans-serif';
			font_bold_16 = 'bold 16px sans-serif';			
		}
		
		canvas_width = canvas.width;
		canvas_height = canvas.height;		
		canvas.height = canvas_height;
    }
}

function getMousePos(canvas, event) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top
	};
}
	
function isInside(mousePos, obj){
	return mousePos.x > obj.x && mousePos.x < obj.x + obj.width && mousePos.y < obj.y + obj.height && mousePos.y > obj.y
}

function handleBack(){
    var url = window.location.href;
    url = url.split('/table/');
    window.location.href = url[0];
}

function Slot(props) {	
	setTimeout(function(){ 	
		my_slot = new slot_game(props);
		my_slot.ready();		
		
		function open_chat(){
			$('.chat_container').toggleClass('open');
		}
		
		$('.chat_button_container').click(function(){
			open_chat();
		});
	}, 0);
	
	socket = props.socket;
	
	return (
		<div className="slot_container">
            <p>Sorry, </p>
            <p>no slots available yet</p>
            <Button className="button_table shadow_convex" type="button" onClick={handleBack}>Back</Button>
			<canvas id="slot_canvas"></canvas>
		</div>
	);
}

function mapStateToProps(state) {	
	return { ...state }
}

export default connect(mapStateToProps)(Slot)