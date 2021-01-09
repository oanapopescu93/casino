import React from 'react';
import $ from 'jquery'; 
import character_img from '../../img/rabbit_move.png';
import map_img from '../../img/map01.jpg';

var canvas;
var ctx;
var socket;
var rpg;
var canvas_width = 600;
var canvas_height = 400;

var map_x = 0;
var map_y = 0;
var map_width = canvas_width;
var map_height = canvas_height;
var map_speed = 10;

var character_width = 40;
var character_height = 40;
var character_x = 20;
var character_y = 50;
var character_pos_x = (map_width-character_width)/2
var character_pos_y = (map_height-character_height)/2

function rpg_game(props){
    var self = this;	
    var map = document.getElementById("rpg_map");
    var character = document.getElementById("rabbit");

	this.ready = function(){
		self.createCanvas(canvas_width, canvas_height);
	}
	
	this.createCanvas = function(canvas_width, canvas_height){		
		canvas = document.getElementById("rpg_game");		
		ctx = canvas.getContext("2d");
        canvas.width = canvas_width;
        canvas.height = canvas_height;
        self.start();
    }
    this.start = function(){		
        ctx.clearRect(0,0, canvas_width, canvas_height);        
        self.draw_map();
        self.draw_character();
        self.rpg_keyboard();
    }
    this.draw_map = function(){
        ctx.drawImage(map, map_x, map_y, map_width, map_height, 0, 0, map_width, map_height);
    }
    this.draw_character = function(){
        ctx.drawImage(character, character_x, character_y, character_width, character_height, character_pos_x, character_pos_y, character_width, character_height); //down
    }

    this.rpg_keyboard = function(){
        document.onkeydown = function(e) {			
			if(e.keyCode == 38){  
                if(wall_collision(map_x, map_y - map_speed, "map")){	          // top
                    map_y = map_y - map_speed
                } else if(wall_collision(character_pos_x, character_pos_y - map_speed, "character")){
                    character_pos_y = character_pos_y - map_speed
                }
			} else if(e.keyCode == 39){ 
                if(wall_collision(map_x + map_speed, map_y, "map")){	          // right	
                    map_x = map_x + map_speed
                } else if(wall_collision(character_pos_x + map_speed, character_pos_y, "character")){
                    character_pos_x = character_pos_x + map_speed
                }
			} else if(e.keyCode == 40){ 
                if(wall_collision(map_x, map_y + map_speed, "map")){	          // bottom	
                    map_y = map_y + map_speed
                } else if(wall_collision(character_pos_x, character_pos_y + map_speed, "character")){
                    character_pos_y = character_pos_y + map_speed
                }
			} else if(e.keyCode == 37){  
                if(wall_collision(map_x - map_speed, map_y, "map")){	         // left
                    map_x = map_x - map_speed
                } else if(wall_collision(character_pos_x - map_speed, character_pos_y, "character")){
                    character_pos_x = character_pos_x - map_speed
                }
            }            
            self.draw_map();
            self.draw_character();			
		}
    }

    function wall_collision(x, y, elem){   
        if(typeof elem != "undefined"){
            switch (elem) {
                case "map":
                    if((map.width - x >= map_width && map.height - y >= map_height) && (x >= 0 && y >= 0)){
                        return true;
                    } 
                    return false;
                case "character":
                    if((x <= map_width-character_width && y <= map_height-character_height) && (x >= 0 && y >= 0)){
                        return true;
                    } 
                    return false;               
              }
        }     
        
    }
}

function Rpg(props) {	
	setTimeout(function(){ 	
		rpg = new rpg_game(props);
		rpg.ready();
	}, 1000);
	
	socket = props.socket;
	
	return (
		<div className="rpg_container">
			<canvas style={{display: "none"}} id="rpg_game"></canvas>
            {/* <canvas id="rpg_game"></canvas> */}
            {/* <img id="rpg_map" style={{display: "none"}} src="https://www.nationsonline.org/maps/australia-map-1400px.jpg"/> */}
            <img id="rpg_map" style={{display: "none"}} src={map_img}/>
            <img id="rabbit" style={{display: "none"}} src={character_img}></img>
		</div>
	);
}

export default Rpg;