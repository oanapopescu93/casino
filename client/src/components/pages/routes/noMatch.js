import React from 'react'
import { Button } from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faHouse} from '@fortawesome/free-solid-svg-icons'
import { translate } from '../../../translations/translate'
import rabbit_stand_left from '../../../img/rabbit_move/rabbit_stand_left.png'
import rabbit_stand_right from '../../../img/rabbit_move/rabbit_stand_right.png'
import Language from '../../settings/language'

function NoMatch(props) {  
    const {lang} = props

    function handleHandleExit(){
        window.location.href = "/"
    }

    return <div id="page-container">
        <Language title={lang} />
        <div className="content_wrap">
            <div className="page_content">
                <div className="page_not_found_box">
                    <h1 className="title">404</h1>
                    <table>
                        <tr>
                            <td className="page_not_found_img">
                                <img className="page_not_found_img" alt="rabbit_stand_left" src={rabbit_stand_left} />
                            </td>
                            <td className="page_not_found_text">                                
                                <p>{translate({lang: lang, info: "page_not_found_text"})}</p>
                                <div className="button_action_group">                    
                                    <Button 
                                        type="button"
                                        className="mybutton round button_transparent shadow_convex"
                                        onClick={()=>handleHandleExit()}
                                    ><FontAwesomeIcon icon={faHouse} /></Button>
                                </div>
                            </td>
                            <td className="page_not_found_img">
                                <img className="page_not_found_img" alt="rabbit_stand_left" src={rabbit_stand_right} />
                            </td>
                        </tr>
                    </table>                    
                </div>                
            </div>
        </div>
    </div>
}
export default NoMatch