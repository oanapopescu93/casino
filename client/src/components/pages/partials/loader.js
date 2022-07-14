import React from 'react';
import logo from '../../img/rabbit_loader/rabbit_run.gif';
function Loader(props){
    let open = "";
    if(props.show){
        open = "open";
    }
	return (
		<div id="loader_container" className={"loader_container "+open}>
            <div className="loader">
                <img alt="logo" src={logo} />
                <h1>Loading</h1>
            </div>
        </div>
	);
}
export default Loader