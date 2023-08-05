import React from 'react'
import { Button } from 'react-bootstrap'
import {useDispatch} from 'react-redux'
import { changePage, changeGame, changeGamePage } from '../../reducers/page'
import { translate } from '../../translations/translate'
import ukraine from '../../img/icons/ukraine.svg'
import Header from '../partials/header'

function Donation(props){
    const {lang, list} = props
    let dispatch = useDispatch()
    let donation_type = ["crypto", "paypal"]

    function handleBack(){
        dispatch(changePage('Salon'))
        dispatch(changeGame(null))
        dispatch(changeGamePage(null))
    }

    return <div className="content_wrap">
        <Header template="donation" title={translate({lang: props.lang, info: "donation"})}></Header>
        <div className="page_content">
            {(() => {
                if(list && list.length>0){
                    return <div className="donation_container">
                        <div className="donation_ukraine">
                            <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/fundraisers/explore/search/charities/?query=ukraine">
                                {translate({lang: props.lang, info: "donation"})} <img id="ukraine_icon" alt="ukraine_icon" src={ukraine}></img>
                            </a>
                        </div>
                        <div className="deco">
                            <div className="donation_box">
                                {donation_type.map(function(item01, i){
                                    let style = "donation_body_paypal"
                                    if(item01 === "crypto"){
                                        style = "donation_body_crypto"
                                    }
                                    return <ul key={i} className={'donation_body ' + style}>
                                        {list.map(function(item02, j){
                                            if(item01 === item02.type){
                                                if(item01 === "crypto"){
                                                    return <li key={j} className="donation_link donation_link_crypto">
                                                        <span>{item02.title}: </span><span>{item02.text}</span>
                                                    </li>                                               
                                                } else if(item01 === "paypal"){
                                                    return <li key={j} className="donation_link donation_link_paypall">
                                                        <a className="mybutton button_transparent shadow_convex" rel="noopener noreferrer" target="_blank" href={item02.link}>{item02.title}</a>
                                                    </li>
                                                } else {
                                                    return null
                                                }
                                            } else {
                                                return null
                                            }   
                                        })}
                                    </ul>
                                })}
                            </div>
                    </div>
                    </div>
                } else {
                    return <div className="donation_container">
                        <p>{translate({lang: lang, info: "no_data"})}</p>
                    </div>
                }
            })()} 
        </div>
        <div className="text_center">
            <Button type="button" onClick={()=>handleBack()} className="mybutton round button_transparent shadow_convex">
                {translate({lang: props.lang, info: "back"})}
            </Button>
        </div>
    </div>
}
export default Donation