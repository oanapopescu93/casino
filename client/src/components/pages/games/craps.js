import React from 'react';
import {connect} from 'react-redux'
import under_construction_icon from '../../img/icons/under_construction_icon.png'

function Roulette(props) {	
	return (
		<>
			<div className="craps_container">
				<h1 className="craps_title"></h1>
				<img className="under_construction_icon" alt="under construction" src={under_construction_icon} />
			</div>
			<div className="show_results_container">
				<div className="show_results">
					<h1></h1>
					<p></p>
				</div>
			</div>
		</>
	);
}

function mapStateToProps(state) {	
	return { ...state }
}

export default connect(mapStateToProps)(Roulette)