import React, {useState} from 'react'
import RaceGame from './raceGame'
import RaceTables from './raceTables'
import { useDispatch } from 'react-redux'
import { changePopup } from '../../../../reducers/popup'
import { translate } from '../../../../translations/translate'
import { resetGame } from '../../../../reducers/games'

function Race(props){
    const {settings} = props
    const {lang} = settings
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
                data: translate({lang: lang, info: "no_bets"})
            }
            dispatch(changePopup(payload))
        }
	}

    function resetBets(){
        dispatch(resetGame("race"))
        setBets([])
    }

    function handleStartGame(){
        setStartRace(false)
    }

    return <>
        {startRace ? <RaceGame 
            {...props} 
            bets={bets} 
            resetBets={()=>resetBets()} 
            handleStartGame={()=>handleStartGame()}
        /> : <RaceTables {...props} getData={(x)=>getData(x)} />}
    </>
}

export default Race