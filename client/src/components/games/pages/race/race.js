import React, {useState} from 'react'
import RaceGame from './raceGame'
import RaceTables from './raceTables'
import { useDispatch } from 'react-redux'
import { changePopup } from '../../../../reducers/popup'
import { translate } from '../../../../translations/translate'

function Race(props){
    const [startRace, setStartRace] = useState(false)
    const [bets, setBets] = useState([])
    let dispatch = useDispatch()

    function calculateTotalBets(array){
        let total = 0
        if(array && array.length>0){
            for(let i in array){
                total = total + array[i].bet
            }
        }
        return total
    }

    function getData(x){
        let total = calculateTotalBets(x)
        if(total>0){
            setBets(x)
		    setStartRace(true)
        } else {
            let payload = {
                open: true,
                template: "error",
                title: "error",
                data: translate({lang: props.lang, info: "no_bets"})
            }
            dispatch(changePopup(payload))
        }
	}

    function resetBets(){
        setBets([])
        setStartRace(false)
    }

    return <>
        {(() => {
            if (startRace) {
                return <RaceGame {...props} bets={bets} resetBets={()=>resetBets()}></RaceGame>
            } else {
                return <RaceTables {...props} getData={(x)=>getData(x)}></RaceTables>
            }	
        })()}
    </>
}

export default Race