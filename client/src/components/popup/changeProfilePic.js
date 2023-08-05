import React, {useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'react-bootstrap'
import { translate } from '../../translations/translate'
import profilePic from '../../img/profile/predators.jpg'
import { decryptData } from '../../utils/crypto'
import { changePic } from '../../reducers/auth'

function ChangeProfilePic(props) {
    const {lang} = props
    let home = useSelector(state => state.home)
    let user = useSelector(state => state.auth.user)
    const [choice, setChoice] = useState(null)
    const [error, setError] = useState(false)
    const [index, setIndex] = useState(-1)
    let dispatch = useDispatch()
    
    let profiles = home.profiles
    let money = decryptData(user.money)  
    let account_type = decryptData(user.account_type)  
    let item_name_lang = "name_eng"
    switch (lang) {
        case "DE":
            item_name_lang = "name_de"
            break
        case "ES":
            item_name_lang = "name_es"
            break
        case "FR":
            item_name_lang = "name_fr"
            break
        case "IT":
            item_name_lang = "name_it"
            break
        case "RO":
            item_name_lang = "name_ro"
            break
        case "ENG":
        default:
            item_name_lang = "name_eng"
            break
    } 

    function choosePic(item, i){
        setError(false)
        if(!item.free && money < 1000 && account_type === 1){
            setError(true)
            setTimeout(function(){ 
                setError(false)
            }, 2000)
        } else {
            setIndex(i)
            setChoice(item.id)
            dispatch(changePic(item.id))
        }
    }

    return <div className="changeProfilePic">
        <div className="changeProfilePic_box">
            {profiles && profiles.length>0 ? <>
                {profiles.map(function(item, i){
                    let show = '' 
                    if(!item.free && money < 1000 && account_type === 1){
                        show = ' grey_image'
                    }
                    let selected = ''
                    if(i === index){
                        selected = ' selected'
                    }
                    return <div key={i} className={"crop_profile_pic_box"+selected} onClick={() => choosePic(item, i)}>
                        <div className="crop_profile_pic shadow_convex">
                            <img alt="profile_pic" className={"profile_pic pic_"+item.id+show} src={profilePic}/>
                        </div>										
                        <p>{item[item_name_lang]}</p>                        
                    </div>
                })}
            </> : <>
                {translate({lang: lang, info: "error"})}
            </>}
            {error ? <div className="alert alert-danger"><p className="text_red">{translate({lang: lang, info: "profile_grey"})}</p></div> : null}
        </div>
        <div className="changeProfilePic_buttons">
            <Button type="button" id="changeProfilePic_btn" className="mybutton button_fullcolor_dark" onClick={()=>props.choosePic({value: choice, uuid: user.uuid, type: "pic"})}>
                {translate({lang: lang, info: "choose"})}
            </Button>
        </div>
    </div>
}

export default ChangeProfilePic