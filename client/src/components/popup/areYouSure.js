import React from 'react'
import { Button } from 'react-bootstrap'
import { translate } from '../../translations/translate'

function AreYouSure(props) {
    const { settings, data, areYouSure } = props
    const { lang } = settings

    return (
        <div className="areYouSure">
            {translate({ lang, info: data })}
            <div className="areYouSure_buttons">
                <div className="areYouSure_button">
                    <Button type="button" onClick={()=>areYouSure(true)} className="mybutton button_fullcolor shadow_convex">
                        {translate({lang, info: "yes"})}
                    </Button>
                </div>
                <div className="areYouSure_button">
                    <Button type="button" onClick={()=>areYouSure(false)} className="mybutton button_fullcolor shadow_convex">
                        {translate({lang, info: "no"})}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default AreYouSure