import React, {useState, useEffect} from 'react'
import CrapsTable from '../craps/crapsTable'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrashCan} from '@fortawesome/free-solid-svg-icons'
import RouletteTable from '../roulette/rouletteTable'

function GameBets(props){
    const {page, update, getData, closeTable} = props

    let open = props.open ? "open" : ""
    let template = page.game.table_name
    const [clear, setClear] = useState(0)

    function handleClear(){
        setClear(prevUpdate => prevUpdate + 1)
        getData(null)
    }

    useEffect(() => {			
		setClear(prevUpdate => prevUpdate + 1)
        getData(null)
	}, [update])

    return <div className={"game_bets_container " + open}>
        <div id={"game_bets_" + template} className="game_bets shadow_concav">
            <div className="close" onClick={()=>closeTable()}>x</div>
            <div className="game_bets_box">						
                {(() => {
                    switch (template) {
                        case "craps":
                            return <CrapsTable {...props} clear={clear} />
                        case "roulette":
                            return <RouletteTable {...props} clear={clear} />
                        default:
                            return null
                    }
                })()}                
            </div>
            <div className="game_bets_clear">
                <div id="game_bets_clear" className="shadow_convex" onClick={()=>handleClear()}>
                    <FontAwesomeIcon icon={faTrashCan}/>
                </div>
            </div>
        </div>
    </div>
}

export default GameBets