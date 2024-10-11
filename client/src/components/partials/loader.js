import React from 'react'
import logo from '../../img/rabbit_loader/rabbit_run.gif'

function Loader(props){
	const {text} = props
	return <div className="loader_container">
		<div className="loader">
			<img alt="logo" src={logo} />
			{text ? <p>{text}</p> : <p>Loading...</p>}
        </div>
	</div>
}
export default Loader