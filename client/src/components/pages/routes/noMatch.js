import React from 'react'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { translate } from '../../../translations/translate'
import Language from '../../settings/language'

import rabbit_stand_left_green from '../../../img/rabbit_move/green/rabbit_stand_left.png'
import rabbit_stand_right_green from '../../../img/rabbit_move/green/rabbit_stand_right.png'
import rabbit_stand_left_yellow from '../../../img/rabbit_move/yellow/rabbit_stand_left.png'
import rabbit_stand_right_yellow from '../../../img/rabbit_move/yellow/rabbit_stand_right.png'
import rabbit_stand_left_orange from '../../../img/rabbit_move/orange/rabbit_stand_left.png'
import rabbit_stand_right_orange from '../../../img/rabbit_move/orange/rabbit_stand_right.png'
import rabbit_stand_left_pink from '../../../img/rabbit_move/pink/rabbit_stand_left.png'
import rabbit_stand_right_pink from '../../../img/rabbit_move/pink/rabbit_stand_right.png'

function NoMatch(props) {
    const { settings } = props
    const { lang, theme } = settings

    function handleHandleExit(){
        window.location.href = "/"
    }

    function chooseImage(side){
        switch (theme) {
            case 'purple':
                if(side === "right"){
                    return rabbit_stand_right_pink
                }
                if(side === "left"){
                    return rabbit_stand_left_pink
                }
                break
            case 'black':
                if(side === "right"){
                    return rabbit_stand_right_green
                }
                if(side === "left"){
                    return rabbit_stand_left_green
                }
                break
            case 'blue':
                if(side === "right"){
                    return rabbit_stand_right_orange
                }
                if(side === "left"){
                    return rabbit_stand_left_orange
                }
                break
            default:
                if(side === "right"){
                    return rabbit_stand_right_yellow
                }
                if(side === "left"){
                    return rabbit_stand_left_yellow
                }
                break
        }
    }

    return <div id="page-container">
        <Language title={lang} />
        <div className="content_wrap">
            <div className="page_content">
                <div className="page_not_found_box">
                    <h1 className="title">404</h1>
                    <table>
                        <tbody>
                            <tr>
                                <td className="page_not_found_img">
                                    <img className="page_not_found_img" alt="rabbit_stand_left" src={chooseImage('left')} />
                                </td>
                                <td className="page_not_found_text">                                
                                    <p>{translate({lang, info: "page_not_found_text"})}</p>
                                    <div className="button_action_group">                    
                                        <Button 
                                            type="button"
                                            className="mybutton round button_transparent shadow_convex"
                                            onClick={()=>handleHandleExit()}
                                        ><FontAwesomeIcon icon={faHouse} /></Button>
                                    </div>
                                </td>
                                <td className="page_not_found_img">
                                    <img className="page_not_found_img" alt="rabbit_stand_left" src={chooseImage('right')} />
                                </td>
                            </tr>
                        </tbody>
                    </table>                    
                </div>                
            </div>
        </div>
    </div>
}
export default NoMatch