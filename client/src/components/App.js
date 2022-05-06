import React, {Component} from 'react';
import './css/bootstrap.css';
import './css/font_roboto.css';
// import './css/font_awesome.css';
import 'font-awesome/css/font-awesome.min.css';
import './css/style.css';
import Home from './pages/home';
import Loader from './pages/partials/loader';

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
		window['console']['log'] = function() {};
		window['console']['warn'] = function() {};
		window['console']['error'] = function() {};
	};

    return me;
}();

class App extends Component {	
	render() {
		my_console.disable();	
		return (
			<div className="App">
				<Loader></Loader>
				<Home></Home>         			
		  	</div>
		);
	}
}

export default App;