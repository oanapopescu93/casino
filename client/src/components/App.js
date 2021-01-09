import React from 'react';

import './css/style.css';
import Home from './pages/home';
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

function App() {
	my_console.disable();	
	return (
		<div className="App"> 
			<div id="loader_container" className="loader_container">
				<div className="loader">
					<img alt="logo" src={logo} />
					<h1>Loading</h1>
				</div>
			</div>
			<Home></Home>			
		</div>
	);
}

export default App;

