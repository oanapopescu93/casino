import React, {useEffect, useState } from 'react'
import Header from '../partials/header'
import SalonGames from './salonGames'
import SalonSidebarLeft from './salonSidebarLeft'
import Game from '../games/game'
import Language from '../settings/language'
import Panel from '../games/sidebar/panel'
import { getWindowDimensions } from '../../utils/utils'

function Salon(props) {    
    const {page, settings} = props
    const {lang, theme} = settings
    const [width, setWidth] = useState(getWindowDimensions().width)
    const [height, setHeight] = useState(getWindowDimensions().height)

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
            <div className="content_wrap">
                <div className="salon_content_box">                    
                    <Header template="salon" details={page} lang={lang} theme={theme}/>
                    <SalonGames {...props} width={width} height={height}/>
                </div>
            </div>
            <SalonSidebarLeft lang={lang} />
            <Panel {...props} />
        </>}
    </>
}

export default Salon