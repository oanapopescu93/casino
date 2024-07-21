import React, {useState, useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { translate } from '../../../../translations/translate'
import { getRoom, get_slots_images } from '../../../../utils/games'
import { getWindowDimensions } from '../../../../utils/utils'
import GameBoard from '../other/gameBoard'
import { changePopup } from '../../../../reducers/popup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'react-bootstrap'
import Header from '../../../partials/header'
import SlotsGame from './slotsGame'
import { decryptData } from '../../../../utils/crypto'

function Slots(props){
	const {page, user, settings, socket} = props
    const {lang} = settings
	const [width, setWidth] = useState(getWindowDimensions().width)
	let money = props.user.money ? decryptData(props.user.money) : 0

	let my_lines = 5
	const [lines, setLines] = useState(my_lines)
	const [slotsData, setSlotsData] = useState(null)
	const [slotsStatus, setSlotsStatus] = useState(false)
	const [slotsBets, setSlotsBets] = useState(1)
	const [items] = useState(get_slots_images())
	const [imagePos, setImagePos] = useState([])

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
        switch(game_type){
			case "reel_3":
				my_lines = 3
				break
			case "reel_5":
			default:
				my_lines = 5				
				break
		}
		setLines(my_lines)
	}, [])

    useEffect(() => {
        let payload = {uuid: user.uuid, lines: my_lines, room: getRoom(page.game), items: items}
        socket.emit('slots_send', payload)
		return () => {}
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
            if(slotsBets > 0){
				setSlotsStatus(true)
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
        }
    }

    function updateStatus(e){
        setSlotsStatus(e)
    }

	function updateBets(e){
        setSlotsBets(e)
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

	function getImagePos(e){
		setImagePos(e)
	}

	function handlePay(pay, win){
		if(pay > 0){
			let game = null
			if(props.page && props.page.game){
				game = props.page.game
			}
			let status = win ? "win" : "lose"
			let money_original = money
			let money_result = win ? money_original + pay : money_original - pay
			let slots_payload = {
				uuid: props.user.uuid,
				game: game,
				money: money_result,
				status: status,
				bet: pay
			}		
			if(typeof props.results === "function"){
				props.results(slots_payload)
			}
		}
	}

	useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                if(slotsBets > 0){
					setSlotsStatus(true)
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
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [slotsData, slotsStatus, slotsBets,lines])

	return <>
		{slotsData ? <div id="slots" className="game_box">
			<Header template={"game"} details={page} lang={lang} />
			<SlotsGame 
				{...props} 
				slotsData={slotsData}
				slotsStatus={slotsStatus}
				slotsBets={slotsBets}
				items={items}
				lines={lines}
				width={width}
				imagePos={imagePos}
				handleShowPrizes={()=>handleShowPrizes()}
				getImagePos={(e)=>getImagePos(e)}
				updateStatus={(e)=>updateStatus(e)}
				handlePay={(pay, win)=>handlePay(pay, win)}
			/>	
			<div className="slot_machine_board">
				<GameBoard template="slots_board" {...props} bet={slotsBets} choice={(e)=>choice(e)} updateBets={(e)=>updateBets(e)} />
			</div>
			{width < 600 ? <div id="slots_prizes" className="mobile shadow_convex" onClick={()=>handleShowPrizes()}>
				{translate({lang: lang, info: "prizes"})}
			</div> : null}
			<div className="button_action_group slots_buttons_container">
				<div className="tooltip">
					<Button 
						type="button"
						className="mybutton round button_transparent shadow_convex"
						onClick={()=>props.handleHandleExit()}
					><FontAwesomeIcon icon={faArrowRotateLeft} /></Button>
					<span className="tooltiptext">{translate({lang: lang, info: "back"})}</span>
				</div>
			</div>
		</div> : null}
	</>
}

export default Slots