import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { translate } from '../../../../translations/translate'
import { getRoom, get_slots_images } from '../../../../utils/games'
import { getWindowDimensions, useHandleErrors } from '../../../../utils/utils'
import { changePopup } from '../../../../reducers/popup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'react-bootstrap'
import Header from '../../../partials/header'
import { decryptData } from '../../../../utils/crypto'
import SlotsGame from './slotsGame'
import GameBoard from '../other/gameBoard'
import { checkBets } from '../../../../utils/checkBets'
import { resetAreYouSure } from '../../../../reducers/areYouSure'

function Slots(props){
	const {page, user, settings, socket, handleHandleExit} = props
    const {lang, theme} = settings

    let areYouSureSlotsMaxBet = useSelector(state => state.areYouSure.areYouSureSlotsMaxBet)
    const handleErrors = useHandleErrors()

	const [width, setWidth] = useState(getWindowDimensions().width)    	
	const [lines, setLines] = useState(0)
	const [slotsData, setSlotsData] = useState(null)
    const [bets, setBets]= useState(1)   
    const [startGame, setStartGame]= useState(false)

    const [images, setImages]= useState(null)
    const [slotReels, setSlotReels] = useState([])
    const [slotResults, setSlotResults] = useState(null)
    const [imagesPos, setImagesPos] = useState([])

    let items = get_slots_images()
    let moneyEncrypted = useSelector(state => state.auth.money)
    let money = moneyEncrypted ? decryptData(moneyEncrypted) : 0
    let room = getRoom(page.game)

	let dispatch = useDispatch()

    useEffect(() => {
        setSlotReels(get_slot_reels())
        setSlotResults(get_slot_results())
    }, [lines])

    function get_slot_reels(){
        const canvases = document.querySelectorAll('.slot_reel')
        const reelArray = Array.from(canvases)
        return reelArray
    }

    function get_slot_results(){
        const canvas = document.getElementById('slot_results')
        return canvas
    }

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
        if(!startGame){
            switch(type){
                case "start":                    
                    if(checkBets({bets, money, lang}, handleErrors)){
                        setStartGame(true)
                    }
                    break
                case "max":
                    let payload = {
                        open: true,
                        template: "are_you_sure",
                        title: "are_you_sure",
                        data: translate({lang, info: "are_you_sure_bets"}),
                        size: "sm",
                    }
                    dispatch(changePopup(payload))
            }
        }
    }

    useEffect(() => {
        if(areYouSureSlotsMaxBet){
            updateBets(money)
        }
    }, [areYouSureSlotsMaxBet])

    useEffect(() => {
		return () => {
			dispatch(resetAreYouSure())
		}
	}, [])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter' && !startGame) {
                if(checkBets({bets, money, lang}, handleErrors)){
                    setStartGame(true)
                }
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [bets])

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

    function getImagePos(e){
		setImagesPos(e)
	}

    function handleResult(sum, win){
        setStartGame(false)
        let status = win ? "win" : "lose"
        let money_result = win ? money + sum : money - sum
        let slots_payload = {
            uuid: user.uuid,
            game: page.game,
            money: money_result,
            status: status,
            bet: sum
        }		
        props.results(slots_payload, win)
    }

	return <div id="slots" className="game_box">
        <Header template={"game"} details={page} lang={lang} theme={theme}/>
        <SlotsGame 
            {...props}
            slotsData={slotsData}
            width={width}
            lines={lines}            
            startGame={startGame}
            images={images}
            slotReels={slotReels} 
            slotResults={slotResults} 
            imagesPos={imagesPos}
            bet={bets}
            handleShowPrizes={()=>handleShowPrizes()}
            getImagePos={(e)=>getImagePos(e)}
            handleResult={(sum, win)=>handleResult(sum, win)}
        />		
        <div className="slot_machine_board">
            <GameBoard 
                {...props}
                template="slots_board" 
                bet={bets} 
                startGame={startGame}
                money={money}
                choice={(e)=>choice(e)}
                updateBets={(e)=>updateBets(e)} 
            />
        </div>
        {width < 600 ? <div id="slots_prizes" className="mobile shadow_convex" onClick={()=>handleShowPrizes()}>
            {translate({lang, info: "prizes"})}
        </div> : null}
        <div className="button_action_group slots_buttons_container">
            <div className="tooltip">
                <Button 
                    type="button"
                    className="mybutton round button_transparent shadow_convex"
                    onClick={()=>handleHandleExit()}
                ><FontAwesomeIcon icon={faArrowRotateLeft} /></Button>
                <span className="tooltiptext">{translate({lang, info: "back"})}</span>
            </div>
        </div>
	</div>
}

export default Slots