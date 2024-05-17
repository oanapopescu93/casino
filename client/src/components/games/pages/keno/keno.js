import React, {useState, useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { translate } from '../../../../translations/translate'
import KenoAnimation from './kenoAnimation'
import KenoBoard from './kenoBoard'
import { changePopup } from '../../../../reducers/popup'
import { decryptData } from '../../../../utils/crypto'

var keno_status = false
function Keno(props){    
    let dispatch = useDispatch()
    const [start, setStart] = useState(false)
    const [data, setData] = useState(null)
    const [resultsPayload, setResultsPayload] = useState(null)
    let money = props.user.money ? decryptData(props.user.money) : 0
    let game = props.page.game
    let dataUpdate = null

    useEffect(() => {
		return () => {
            if(keno_status){
                let keno_bets = 1
                let keno_payload = {
                    uuid: props.user.uuid,
                    game: game,
                    status: 'lose',
                    bet: keno_bets,
                    money: money - keno_bets
                }
                
                props.results(keno_payload)
                setStart(false)
                keno_status = false
                setResultsPayload(null)
            }
		}
    }, [])

    useEffect(() => {
        if(data){
            let keno_bets = data.no_of_games * data.price_per_game
            let status = 'lose'
            let pay = money
            let numbers_matched = 0
            if(resultsPayload && resultsPayload.list_filtered && resultsPayload.list_filtered.length>0){
                numbers_matched = resultsPayload.list_filtered.length
            }
            
            if(numbers_matched>0){
                let win = 0
                for(let i in resultsPayload.list_filtered){
                    if(resultsPayload.list_filtered[i].numbers_matched === numbers_matched){
                        win = resultsPayload.list_filtered[i].win
                        break
                    }
                }
                if(win>0){
                    pay = pay + win
                    status = 'win'
                } else {
                    pay = pay - keno_bets
                }
            } else {
                pay = pay - keno_bets
            }       
            
            let keno_payload = {
                uuid: props.user.uuid,
                game: game,
                status: status,
                bet: keno_bets,
                money: pay
            }
            
            props.results(keno_payload)
            setStart(false)
            keno_status = false
            setResultsPayload(null)
        }
    }, [resultsPayload])

    function startGame(){
        if(dataUpdate && dataUpdate.list && dataUpdate.list.length>0){ 
            if(dataUpdate.price_per_game>0){
                setStart(true)
                keno_status = true
            } else {
                let payload = {
                    open: true,
                    template: "error",
                    title: "error",
                    data: translate({lang: props.lang, info: "no_bets"})
                }
                dispatch(changePopup(payload))
            }
        } else {
            let payload = {
                open: true,
                template: "error",
                title: "error",
                data: translate({lang: props.lang, info: "no_selections"})
            }
            dispatch(changePopup(payload))
        }        
    }

    function getData(x){
        setData(x)
        dataUpdate = x
    }    

    function handleShowPrizes(){
        let payload = {
            open: true,
            template: "keno_prizes",
            title: "keno_prizes",
            data: props.home.keno_prizes,
            size: 'lg',
        }
        dispatch(changePopup(payload))
    }

    function getResults(x){
        setResultsPayload(x)
    } 

    return <>
        {start ? <KenoAnimation 
            {...props} 
            data={data}            
            handleShowPrizes={()=>handleShowPrizes()}
            getResults={(e)=>getResults(e)}
            resultsPayload={resultsPayload}
        ></KenoAnimation> : <KenoBoard 
            {...props} 
            startGame={()=>startGame()}
            getData={(e)=>getData(e)}
        ></KenoBoard>}
    </>
}

export default Keno