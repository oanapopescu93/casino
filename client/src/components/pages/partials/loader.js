import React from 'react';
import logo from '../../img/rabbit_loader/rabbit_run.gif';
function Loader(){
	return (
		<div id="loader_container" className="loader_container">
            <div className="loader">
                <img alt="logo" src={logo} />
                <h1>Loading</h1>
            </div>
        </div>
	);
}
export default Loader