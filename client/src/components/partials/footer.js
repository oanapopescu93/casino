import React, { useEffect, useState } from 'react'
import {useDispatch} from 'react-redux'
import { changePage, changeGame, changeGamePage } from '../../reducers/page'
import { translate } from '../../translations/translate'
import ukraine from '../../img/icons/ukraine.svg'
import { checkWinterMonths } from '../../utils/special_occasions'
import { getWindowDimensions } from '../../utils/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'

function Footer(props){
    let dispatch = useDispatch()
    const [date, setDate] = useState('')
    const [up, setUp] = useState('')
    const [showWinter, setShowWinter] = useState(false)

    useEffect(() => {
        handleDate()
        let winter = checkWinterMonths()
		if(winter && getWindowDimensions().width >= 960){ // will appear only on winter months and only if the width is more than 960
			setShowWinter(true)
		}
    }, [])    

    function handleDate(){
        let my_date = new Date()
		my_date = my_date.getFullYear()
        setDate(my_date)
    }

    function handleClick(choice){
        dispatch(changePage(choice))
        dispatch(changeGame(null))
        dispatch(changeGamePage(null))
    }

    function handleFooterUp(){
        if(up === ''){
            setUp('up')
        } else {
            setUp('')
        }
    }

    return <div className={"footer_container " + up}>
        <div className="footer_button_container">
            <div className={showWinter ? "footer_button snow_small" : "footer_button"} onClick={()=>handleFooterUp()}>
                <span><FontAwesomeIcon icon={up === "up" ? faChevronDown : faChevronUp} /></span>
            </div>
        </div>
        <div className="footer_body">
            <div className="footer_list">
                <ul>                    
                    <li onClick={()=>{handleClick('About')}}><span>{translate({lang: props.lang, info: "about"})}</span></li>                    
                    <li onClick={()=>{handleClick('terms_cond')}}><span>{translate({lang: props.lang, info: "terms_cond"})}</span></li>
                    <li onClick={()=>{handleClick('policy_privacy')}}><span>{translate({lang: props.lang, info: "policy_privacy"})}</span></li>
                    <li onClick={()=>{handleClick('Questions')}}><span>{translate({lang: props.lang, info: "questions"})}</span></li>
                    <li onClick={()=>{handleClick('Career')}}><span>{translate({lang: props.lang, info: "career"})}</span></li>
                    <li onClick={()=>{handleClick('Contact')}}><span>{translate({lang: props.lang, info: "contact"})}</span></li>
                    <li><a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/fundraisers/explore/search/charities/?query=ukraine"><img id="ukraine_icon" alt="ukraine_icon" src={ukraine}></img></a></li>
                </ul>
            </div>
            <footer>
                <h6>Copyright © <span id="copyright_year">{date}</span> Oana Popescu. {translate({lang: props.lang, info: "all_rights_reserved"})}.</h6>
            </footer>
        </div>
    </div>
}
export default Footer