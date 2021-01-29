import React, {Component} from 'react';
import $ from 'jquery'; 
import './css/style.css';
import Home from './pages/home';
import Splash from './pages/splash_screen';
import logo from './img/rabbit_loader/rabbit_run.gif';

var my_console = function(){
    var oldConsole = null;
    var me = {};

    me.enable =  function enable(){
		if(oldConsole == null) return;
		window['console']['log'] = oldConsole;
		window['console']['warn'] = oldConsole;
		window['console']['error'] = oldConsole;
	};

    me.disable = function disable(){
		oldConsole = console.log;
		// window['console']['log'] = function() {};
		window['console']['warn'] = function() {};
		// window['console']['error'] = function() {};
	};

    return me;
}();

function randomIntFromInterval(min, max) { // min and max included 
	return Math.floor(Math.random() * (max - min + 1) + min);
}

var self;

class App extends Component {
	constructor(props) {
		super(props);
		self = this;
		self.state = {
		  	visible: false
		};
		self.splash_screen = self.splash_screen.bind(self);
		self.progress_move = self.progress_move.bind(self);
	}

	splash_screen = function(){	
		setTimeout(function(){
			self.progress_move();
		}, 2000);
	}	

	progress_move = function(){	
		if(typeof $('#myBar') != "undefined"){
			var width = 0;
			var id = setInterval(frame, 1000);
			function frame() {
				var random = randomIntFromInterval(1, 20)	
				width = width + random;
				if (width >= 100) {
					$('#myBar').width("100%");
					$('#myBar_text_container').width("100%");	
					$('#myBar_text').text("100%");
					clearInterval(id);
					setTimeout(function(){
						self.setState({ visible: true });
					}, 2000);
				} else {
					$('#myBar').width( width + "%");
					$('#myBar_text_container').width( width + "%");	
					$('#myBar_text').text( width + "%");	
				}
			}
		}
	}	
	
	render() {
		my_console.disable();
		self.splash_screen();	
		return (
			<div className="App">
				{ !this.state.visible ? <Splash></Splash>  : null }
        		
				{ 
					this.state.visible ? 
					<>
						<div id="loader_container" className="loader_container">
							<div className="loader">
								<img alt="logo" src={logo} />
								<h1>Loading</h1>
							</div>
						</div>
						<Home></Home>  
					</>
					
					: null 
				}
        			
		  	</div>
		);
	  }
}

export default App;

