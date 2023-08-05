import React, {useState} from 'react'
import RouletteTable from '../roulette/rouletteTable'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrashCan} from '@fortawesome/free-solid-svg-icons'
import CrapsTable from '../craps/crapsTable'

function GameBets(props){
    let open = props.open ? "open" : ""
    let template = props.page.game.table_name
    const [clear, setClear] = useState(0)
    let t = 0

    function handleClose(){
        props.closeTable()
    }

    function handleClear(){
        t++
        setClear(t)
        props.getData(null)
    }

    function getData(x){
        props.getData(x)
	}

    return <div className={"game_bets_container " + open}>
        <div className="game_bets shadow_concav">
            <div className="close" onClick={()=>handleClose()}>x</div>
            <div className="game_bets_box">						
                {(() => {
                    switch (template) {
                        case "craps":
                            return <CrapsTable {...props} clear={clear} getData={(e)=>getData(e)}></CrapsTable>
                        case "roulette":
                            return <RouletteTable {...props} clear={clear} getData={(e)=>getData(e)}></RouletteTable>               
                        default:
                            return null
                    }
                })()}
                <div className="game_bets_clear">
                    <div id="game_bets_clear" className="shadow_convex" onClick={()=>handleClear()}>
                        <FontAwesomeIcon icon={faTrashCan}/>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default GameBets