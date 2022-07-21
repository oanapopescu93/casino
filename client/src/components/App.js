import React from 'react';
import './css/bootstrap.css';
import './css/font_roboto.css';
import 'font-awesome/css/font-awesome.min.css';
import './css/style.css';
import Home from './pages/home';
import Loader from './pages/partials/loader';
import { useSelector} from 'react-redux'

let my_console = function(){
    let oldConsole = null;
    let me = {};
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

function App(props){	
	// my_console.disable();
	let page = useSelector(state => state.page);
	let show_loader = useSelector(state => state.load);
	return (
		<div className="App">
			<Loader show={show_loader}></Loader>
			<Home page={page} show={show_loader}></Home>         			
		</div>
	);
}

export default App;