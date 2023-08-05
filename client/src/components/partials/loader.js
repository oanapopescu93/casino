import React from 'react'
import logo from '../../img/rabbit_loader/rabbit_run.gif'

function Loader(props){
	return <div className="loader_container">
		<div className="loader">
			<img alt="logo" src={logo} />
			<p>Loading...</p>
        </div>
	</div>
}
export default Loader