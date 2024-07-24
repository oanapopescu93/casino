import React, {useEffect, useState } from 'react'
import Header from '../partials/header'
import SalonGames from './salonGames'
import SalonSidebarLeft from './salonSidebarLeft'
import Game from '../games/game'
import Language from '../settings/language'
import Panel from '../games/sidebar/panel'
import ChatBotButton from '../partials/chatBotButton'
import { getWindowDimensions } from '../../utils/utils'
// import { changeGamePage, changePage, changeGame } from "../../reducers/page"
// import { useDispatch } from 'react-redux'

function Salon(props) {    
    const {page, settings} = props
    const {lang} = settings
    const [width, setWidth] = useState(getWindowDimensions().width)
    const [height, setHeight] = useState(getWindowDimensions().height)
    // let dispatch = useDispatch()

    // function handleWhack(){
    //     dispatch(changePage('Salon'))
    //     dispatch(changeGamePage(null))
    //     dispatch(changeGame({table_name: "whack_a_rabbit"}))
    // }

    function handleResize(){
        setWidth(getWindowDimensions().width)
        setHeight(getWindowDimensions().height)
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("resize", handleResize)
            handleResize()
            return () => window.removeEventListener("resize", handleResize)
        }
	}, [])

    return <>
        {page.game ? <Game {...props} /> : <>
            <Language title={lang} />
            {height < 500 ? <div className="chatbot_button_container_small">
                <ChatBotButton />
            </div> : null}
            <div className="content_wrap">
                <div className="salon_content_box">                    
                    <Header template="salon" lang={lang} />
                    <SalonGames {...props} width={width} height={height}/>
                </div>
            </div>
            <SalonSidebarLeft lang={lang} />
            <Panel {...props} />
            {/* <div onClick={()=>handleWhack()}>test whack</div> */}
        </>}
    </>
}

export default Salon