import React, {useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'react-bootstrap'
import { translate } from '../../translations/translate'
import { decryptData } from '../../utils/crypto'
import { changePic } from '../../reducers/auth'
import Carousel from '../carousel/carousel'

function ChangeProfilePic(props) {
    const {settings, home, user, choosePic} = props
    const {lang} = settings
    const {finances} = home
    
    let profiles = home.profiles
    let picId = user.profile_pic ? decryptData(user.profile_pic) : 0
    let indexProfile = profiles.findIndex((x) => x.id === parseInt(picId))
    let moneyEncrypted = useSelector(state => state.auth.money)
    let money = moneyEncrypted ? decryptData(moneyEncrypted) : 0
    let account_type = user.account_type ? decryptData(user.account_type) : 1
    let min_free = finances.min_free ? finances.min_free : 1000

    const [choice, setChoice] = useState(null)
    const [error, setError] = useState(false)
    const [index, setIndex] = useState(indexProfile)

    let dispatch = useDispatch() 
    
    let profile_carousel_options = {
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        swipeToSlide: true,
        draggable: true,
        dots: false,
        arrows: true,
        initialSlide: 0,
        swipeThreshold: 20,
    }

    function handlePic(item, i){
        setError(false)
        if(!item.free && money < min_free && account_type === 1){
            setError(true)
            setTimeout(()=>{ 
                setError(false)
            }, 3000)
        } else {
            setIndex(i)
            setChoice(item.id)
        }
    }

    function handleClick(e){
        dispatch(changePic(e.value))
        choosePic(e)
    }    

    return <div className="changeProfilePic">
        <div className="changeProfilePic_box">
            {profiles && profiles.length>0 ? <>
                <Carousel 
                    {...props}
                    id="carousel_profile"
                    template="profile" 
                    options={profile_carousel_options} 
                    itemList={profiles} 
                    handlePic={(item, i)=>handlePic(item, i)}
                    money={money}
                    account_type={account_type}
                    selected={index}
                    finances={finances}
                />
            </> : <>
                {translate({lang, info: "error"})}
            </>}
            {error ? <p className="profile_grey">{translate({lang, info: "profile_grey"})}</p> : null}
        </div>
        <div className="changeProfilePic_buttons">
            <Button type="button" id="changeProfilePic_btn" className="mybutton button_fullcolor_dark" onClick={()=>handleClick({value: choice, uuid: user.uuid, type: "pic"})}>
                {translate({lang, info: "choose"})}
            </Button>
        </div>
    </div>
}

export default ChangeProfilePic