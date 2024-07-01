import React, { useEffect, useState } from 'react'
import { translate } from "../../translations/translate"

function Welcome(props){
    const [isActive, setIsActive] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsActive(true)
        }, 800)

        return () => clearTimeout(timer)
    }, [])

    return <div id="welcome_popup" className="welcome_popup">
        <div className="box_container">
            <div className="box">
                <div className={`box_body ${isActive ? 'active' : ''}`}>
                    <div className="img">
                        <p className="gift_text">
                            <span>{translate({lang: props.lang, info: "welcome"})}</span>
                            <span>{translate({lang: props.lang, info: "welcome_text"})}</span>
                        </p>
                    </div>
                    <div className="box_lid">
                        <div className="box_bowtie"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}
export default Welcome