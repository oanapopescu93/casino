import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { decryptData } from '../../../../../utils/crypto'
import { translate } from '../../../../../translations/translate'
import profilePic from '../../../../../img/profile/predators.jpg'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUser, faUpload} from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from 'react-redux'
import { changePopup } from '../../../../../reducers/popup'
import { changePage, changeGame, changeGamePage } from '../../../../../reducers/page'
import { Button } from 'react-bootstrap'

function Picture(props){
	let picId = props.pic_id

	function choosePic(){
		if(typeof props.choice === "function"){
            props.choice('change_pic')
        }
	}	

	return <div className="profile_pic_container shadow_convex" onClick={()=>choosePic()}>
        <div className="profile_pic_default">
            <FontAwesomeIcon icon={faUpload} />
        </div>
        {(() => {
            if(picId) {
                return <div className="profile_pic">
                    <div className="crop_profile_pic">
                        <img alt="profile_pic" className={"profile_pic pic_"+picId} src={profilePic}/>
                    </div>
                </div>
            } else {
                return <div className="profile_pic">
                    <FontAwesomeIcon icon={faUser}/>
                </div>
            }	
        })()}
    </div>
}

function DashboardLeft(props){ 
    const {home, user, lang} = props
    let dispatch = useDispatch()

    let name = user.user ? decryptData(user.user) : "-"
    let money = user.money ? decryptData(user.money) : 0
    let profiles = home.profiles
    let picId = user.profile_pic ? decryptData(user.profile_pic) : 1
    let animal = profiles.filter(function(x){
        return x.id === parseInt(picId)
    })

    function handleChoice(choice){
        if(choice === "buy_carrots"){            
            dispatch(changePage('BuyCarrots'))
            dispatch(changeGame(null))
            dispatch(changeGamePage(null))
        } else {
            let title = ""
            let data = null
            let size = 'sm'
            switch(choice) {
                case "change_pic":
                    title = "choose_profile_pic"
                    data = profiles
                    size = 'lg'
                    break
                case "change_username":
                case "change_password":
                    title = choice
                    break
                default:              
            }
            
            let payload = {
                open: true,
                template: choice,
                title,
                size,
            }
            if(data){
                payload.data = data
            }
            dispatch(changePopup(payload))
        }        
	}

    return <div id="dashboard_left" className="dashboard_box shadow_concav">
        <Row>
            <Col sm={6} className="dashboard_user_pic">
                <Picture profiles={profiles} pic_id={picId} choice={(e)=>handleChoice(e)}></Picture>
            </Col>
            <Col sm={6} className="dashboard_user_info">
                <p className="dashboard_user">
                    <b>{translate({lang: lang, info: "user"})}: </b><span id="dashboard_user_text">{name}</span>
                </p>										
                <p className="dashboard_animal">
                    <b>{translate({lang: lang, info: "animal"})}: </b>
                    {(() => {                        
                        if(animal && animal[0]){                            
                            switch (props.lang) {
                                case "DE":
                                    return <>{animal[0].name_de}</>
                                case "ES":
                                    return <>{animal[0].name_es}</>
                                case "FR":
                                    return <>{animal[0].name_fr}</>
                                case "IT":
                                    return <>{animal[0].name_it}</>
                                case "PT":
                                    return <>{animal[0].name_pt}</>
                                case "RO":
                                    return <>{animal[0].name_ro}</>
                                case "RU":
                                    return <>{animal[0].name_ru}</>
                                case "ENG":
                                default:
                                    return <>{animal[0].name_eng}</>
                            } 
                        } else {
                            return "-"
                        }
                    })()}
                </p>
                <p className="dashboard_money">
                    <b>{translate({lang: lang, info: "carrots"})}: </b>{money}
                </p>
            </Col>
        </Row>	
        <Row>
            <Col sm={12} className="dashboard_left_buttons">
                <Button type="button" onClick={()=>handleChoice("change_username")} className="mybutton button_fullcolor shadow_convex">
                    {translate({lang: lang, info: "change_username"})}
                </Button>	
                <Button type="button" onClick={()=>handleChoice("change_password")} className="mybutton button_fullcolor shadow_convex">
                    {translate({lang: lang, info: "change_password"})}
                </Button>	
                <Button type="button" onClick={()=>handleChoice("buy_carrots")} className="mybutton button_fullcolor shadow_convex">
                    {translate({lang: lang, info: "buy_carrots"})}
                </Button>	
            </Col>
        </Row>
    </div>
}
export default DashboardLeft