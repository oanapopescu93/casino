import React from 'react'
import { translate } from '../../../translations/translate'
import { Button } from 'react-bootstrap'
import Spinner from '../../partials/spinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'

function VerifyEmail(props) {    
    const {settings, verifyEmail, verifyEmailTexts} = props
    const {lang, theme} = settings

    function chooseColor(){
        switch (theme) {
            case 'purple':
                return 'pink'
            case 'black':
                return '#32CD32' // Lime Green
            case 'blue':
                return '#ff8000' // orange
            default:
              return 'gold'
        }
    }

    function handleHomePage(){
        window.location.href = "/"
    }

    return <div id="page-container">
        <div className="content_wrap">
            <div className="page_content">
                <div className="email_verification_box">
                    <h1>{translate({lang, info: "email_verification"})}</h1>                    
                    {verifyEmail === 1 ? <Spinner size="small" color={chooseColor(theme)}/> : <>
                        <p>{translate({lang, info: verifyEmailTexts[verifyEmail]})}</p>
                        <Button type="button" className="mybutton round button_transparent shadow_convex" onClick={()=>handleHomePage()}>
                            <FontAwesomeIcon icon={faHouse} />
                        </Button>                    
                    </>}
                </div>                
            </div>
        </div>
    </div>
}
export default VerifyEmail