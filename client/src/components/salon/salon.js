import React from 'react'
import Header from '../partials/header'
import SalonGames from './salonGames'
import SalonSidebarLeft from './salonSidebarLeft'
import Game from '../games/game'
import Language from '../settings/language'
import Panel from '../games/sidebar/panel'
import { changeGamePage, changePage, changeGame } from "../../reducers/page"
import { useDispatch } from 'react-redux'

function Salon(props) {    
    const {page, settings} = props
    const {lang} = settings
    let dispatch = useDispatch()

    function handleWhack(){
        dispatch(changePage('Salon'))
        dispatch(changeGamePage(null))
        dispatch(changeGame({table_name: "whack_a_rabbit"}))
    }

    return <>
        {page.game ? <Game {...props} /> : <>
            <Language title={lang} />
            <div className="content_wrap">
                <Header template="salon" lang={lang} />
                <SalonGames {...props} />
            </div>
            <SalonSidebarLeft lang={lang} />
            <Panel {...props} />
            <div style={{'display': 'none'}}onClick={()=>handleWhack()}>test whack</div>
        </>}
    </>
}

export default Salon