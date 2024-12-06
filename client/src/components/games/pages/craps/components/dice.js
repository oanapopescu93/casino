import React from 'react'

function Dice(props){
    const {number, showNumbers} = props

	return <div className="dice_box">
		<div id={'dice'+number} className={"dice dice_" + number + " show_" + showNumbers[number]}>
			<div id={"dice_"+number+"_side_one"} className='side one'>
				<div className="dot one_1"></div>
			</div>
			<div id={"dice_"+number+"_side_two"} className='side two'>
				<div className="dot two_1"></div>
				<div className="dot two_2"></div>
			</div>
			<div id={"dice_"+number+"_side_three"} className='side three'>
				<div className="dot three_1"></div>
				<div className="dot three_2"></div>
				<div className="dot three_3"></div>
			</div>
			<div id={"dice_"+number+"_side_four"} className='side four'>
				<div className="dot four_1"></div>
				<div className="dot four_2"></div>
				<div className="dot four_3"></div>
				<div className="dot four_4"></div>
			</div>
			<div id={"dice_"+number+"_side_five"} className='side five'>
				<div className="dot five_1"></div>
				<div className="dot five_2"></div>
				<div className="dot five_3"></div>
				<div className="dot five_4"></div>
				<div className="dot five_5"></div>
			</div>
			<div id={"dice_"+number+"_side_six"} className='side six'>
				<div className="dot six_1"></div>
				<div className="dot six_2"></div>
				<div className="dot six_3"></div>
				<div className="dot six_4"></div>
				<div className="dot six_5"></div>
				<div className="dot six_6"></div>
			</div>					
		</div>
		<div className="dice_box_shadow"></div>
	</div>
}

export default Dice