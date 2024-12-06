import React, {useState, useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { translate } from '../../../../translations/translate'
import { getRoom, get_slots_images } from '../../../../utils/games'
import { getWindowDimensions } from '../../../../utils/utils'
import { changePopup } from '../../../../reducers/popup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'react-bootstrap'
import Header from '../../../partials/header'
import { decryptData } from '../../../../utils/crypto'
import SlotsGame from './slotsGame'
import GameBoard from '../other/gameBoard'

function Slots(props){
	const {page, user, settings, socket, handleHandleExit} = props
    const {lang, theme} = settings

	const [width, setWidth] = useState(getWindowDimensions().width)    	
	const [lines, setLines] = useState(0)
	const [slotsData, setSlotsData] = useState(null)
    const [bets, setBets]= useState(0)
    const [images, setImages]= useState(null)
    const [startGame, setStartGame]= useState(false)

    let items = get_slots_images()
    let money = user.money ? decryptData(user.money) : 0
    let room = getRoom(page.game)

	let dispatch = useDispatch()	

	function handleResize(){
        setWidth(getWindowDimensions().width)
    }

    useEffect(() => {
        if (typeof window !== "undefined"){
            window.addEventListener("resize", handleResize)
            handleResize()
            return () => window.removeEventListener("resize", handleResize)
        }
	}, [])

	useEffect(() => {
		let game = page.game
		let game_type = game.table_type
        let payload = {uuid: user.uuid, room, items}

        switch(game_type){
			case "reel_3":
				setLines(3)
                payload.lines = 3
				break
			case "reel_5":
			default:
				setLines(5)
                payload.lines = 5
				break
		}

        socket.emit('slots_send', payload)
	}, [])

    useEffect(() => {
		const handleSlotsRead = (data)=>{
            if(data){
                setSlotsData(data)
            }
        }
		socket.on('slots_read', handleSlotsRead)
		return () => {
            socket.off('slots_read', handleSlotsRead)
        }
    }, [socket])

    function choice(type){	
        if(type === "start" && slotsData){
            if(bets > 0){
				setStartGame(true)
            } else {
                let payload = {
                    open: true,
                    template: "error",
                    title: translate({lang: lang, info: "error"}),
                    data: translate({lang: lang, info: "no_bets"}),
					size: "sm",
                }
                dispatch(changePopup(payload))
            }
        } else {
            let payload = {
                open: true,
                template: "error",
                title: translate({lang: lang, info: "error"}),
                data: translate({lang: lang, info: "error"}),
                size: "sm",
            }
            dispatch(changePopup(payload))
        }
    }

	function updateBets(e){
        setBets(e)
    }

	function handleShowPrizes(){
		let payload = {
            open: true,
            template: "slots_prizes",
            title: "slots_prizes",
            data: slotsData,
			size: 'sm'
        }
        dispatch(changePopup(payload))
	}

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
			image.setAttribute('coord_x', item.coord[0])
			image.setAttribute('coord_y', item.coord[1])
			image.addEventListener("load", ()=>{
				resolve(image)
			}, false)
		})
	}

	return <div id="slots" className="game_box">
        <Header template={"game"} details={page} lang={lang} theme={theme}/>
        <p>{translate({lang: lang, info: "under_construction"})}</p>
        <SlotsGame 
            {...props}
            slotsData={slotsData}
            width={width}
            lines={lines}
            images={images}
            startGame={startGame}
            handleShowPrizes={()=>handleShowPrizes()}
        />		
        <div className="slot_machine_board">
            <GameBoard 
                {...props}
                template="slots_board" 
                bet={bets} 
                startGame={startGame}
                choice={(e)=>choice(e)}
                updateBets={(e)=>updateBets(e)} 
            />
        </div>
        {width < 600 ? <div id="slots_prizes" className="mobile shadow_convex" onClick={()=>handleShowPrizes()}>
            {translate({lang: lang, info: "prizes"})}
        </div> : null}
        <div className="button_action_group slots_buttons_container">
            <div className="tooltip">
                <Button 
                    type="button"
                    className="mybutton round button_transparent shadow_convex"
                    onClick={()=>handleHandleExit()}
                ><FontAwesomeIcon icon={faArrowRotateLeft} /></Button>
                <span className="tooltiptext">{translate({lang: lang, info: "back"})}</span>
            </div>
        </div>
	</div>
}

export default Slots