import React from 'react'
import { translate } from '../../../../../translations/translate'

function Board(props){
    const { settings, list } = props
    const { lang } = settings

	return <>
		{list && list.length>0 ? <>
			{list.map((item, i)=>{
                const { dices, point, sum } = item

                if(dices === "Craps!!!" || dices === "Natural!!!"){
                    return <div key={i} className="craps_board_text">
                        <span className="text text01">{dices}</span>
                    </div>
                } else if(point){
                    return <div key={i} className="craps_board_text">
                        <span className="text text01">{translate({lang, info: "dices"})}:</span>
                        <span className="text text02">{dices[0]}, {dices[1]}</span>
                        <span className="text text03">{translate({lang, info: "sum"})}:</span>
                        <span className="text text04">{sum}</span>
                        <span className="text text05">{translate({lang, info: "point"})}:</span>
                        <span className="text text06">{point}</span>
                    </div>
                } else {
                    return <div key={i} className="craps_board_text">
                        <span className="text text01">{translate({lang, info: "dices"})}:</span>
                        <span className="text text02">{dices[0]}, {dices[1]}</span>
                        <span className="text text03">{translate({lang, info: "sum"})}:</span>
                        <span className="text text04">{sum}</span>
                    </div>	
                }
			})}
		</> : null}
	</>
}

export default Board