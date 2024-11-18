import React from 'react'
import logo_yellow from '../../img/rabbit_loader/animation/rabbit_run_yellow.gif'
import logo_pink from '../../img/rabbit_loader/animation/rabbit_run_pink.gif'
import logo_green from '../../img/rabbit_loader/animation/rabbit_run_green.gif'
import logo_orange from '../../img/rabbit_loader/animation/rabbit_run_orange.gif'

function Loader(props){
	const {text, theme} = props

	function chooseImage(){
        switch (theme) {
            case 'purple':
              return logo_pink
            case 'black':
              return logo_green
            case 'blue':
              return logo_orange
            default:
              return logo_yellow
        }
    }

	return <div className="loader_container">
		<div className="loader">
			<img alt="logo" src={chooseImage()} />
			{text ? <p>{text}</p> : <p>Loading...</p>}
        </div>
	</div>
}
export default Loader