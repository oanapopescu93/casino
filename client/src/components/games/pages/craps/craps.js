import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import CrapsGame from './crapsGame'
import GameBets from '../other/gameBets'
import { changeCrapsBets } from '../../../../reducers/games'
import { get_craps_bets } from '../../../../utils/games'

function Craps(props){
    let bets = useSelector(state => state.games.craps.bets)	

    const [open, setOpen] = useState(false)
    const [images, setImages] = useState(null)

    let dispatch = useDispatch()
    let items = get_craps_bets()

    useEffect(() => {	
		dispatch(changeCrapsBets({game_type: "pass line", game_odds: 2, bet: 1}))
        return () => {
            dispatch(changeCrapsBets({bets: null, lucky_bet: null, result: null}))
        }
	}, [])

    useEffect(() => {
        let promises = []
        for(let i in items){				
            promises.push(preaload_images(items[i]))
        }
        Promise.all(promises).then((result)=>{
            setImages(result)
        })
    }, [])

    function preaload_images(item){
		return new Promise((resolve)=>{
			let image = new Image()
			image.id = item.id
			image.src = item.src
			image.addEventListener("load", ()=>{
				resolve(image)
			}, false)
		})
	}

    function getData(x){
        dispatch(changeCrapsBets(x))
	}

    function openTable(){setOpen(true)}
    function closeTable(){setOpen(false)}
    
    function results(x){
        props.results(x)
    }

    return <div id="craps" className='game_container'>
        <CrapsGame {...props} bets={bets} openTable={()=>openTable()} results={(e)=>results(e)} />
        <GameBets {...props} open={open} images={images} getData={(e)=>getData(e)} closeTable={()=>closeTable()} />
    </div>
}

export default Craps