import React, {useState, useRef} from 'react'
import { translate } from '../../translations/translate'
import Counter from '../partials/counter'
import Stars from '../rating/stars'
import { Button, Row, Col } from 'react-bootstrap'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBasketShopping, faCarrot } from '@fortawesome/free-solid-svg-icons'
import vegetables_yellow from '../../img/icons/vegetables/vegetables_yellow.png'
import vegetables_pink from '../../img/icons/vegetables/vegetables_pink.png'
import vegetables_green from '../../img/icons/vegetables/vegetables_green.png'
import vegetables_orange from '../../img/icons/vegetables/vegetables_orange.png'
import profilePic from '../../img/profile/predators.jpg'
import { convertCurrency } from '../../utils/utils'

function Cell(props) {
    const {
        index, selected, data, template, account_type, money, settings, exchange_rates, finances, handlePic,
        getRabbitsInfo
    } = props
    const {lang, currency, theme} = settings

    let place = translate({lang, info: 'place'})

    const [qty, setQty] = useState(1)
    const [titleDropdown, setTitleDropdown] = useState(place)
    const [isDragging, setIsDragging] = useState(false) 
    
    let max_bet = money
    
    const dragStart = useRef({ x: 0, y: 0 })
    const dragThreshold = 5 // pixels

    function updateQtyMarket(x){
        setQty(x)
    }

    function updateRaceBet(x){        
        getRabbitsInfo({id: data.id, bet: x, place: 1})
    }

    function handleDropdown(x){        
        getRabbitsInfo({id: data.id, place: x})
        switch(x) {
            case '3':
                setTitleDropdown(translate({lang, info: "place_03"}))
                break
            case '2':
                setTitleDropdown(translate({lang, info: "place_02"}))
                break
            case '1':
            default: 
                setTitleDropdown(translate({lang, info: "place_01"}))
        }
    }

    function getItem(x){        
        switch (template) {
            case "market":
                let id = data.id ? data.id : null
                let payload_market = {id, qty} 
                props.getItem(payload_market)
                break
            case "salon":
                let table_name = x.table_name ? x.table_name : null
                let table_type = x.table_type ? x.table_type : null
                let table_id = x.table_id ? x.table_id : null
                let payload_race = {table_name, table_type, table_id}
                props.getItem(payload_race)
                break
        }
    }

    const handleMouseDown = (e) => {
        setIsDragging(false)
        dragStart.current = { x: e.clientX, y: e.clientY }
      }
    
    const handleMouseMove = (e) => {
        const dx = e.clientX - dragStart.current.x
        const dy = e.clientY - dragStart.current.y
        if (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold) {
          setIsDragging(true)
        }
    }
    
    const handleMouseUp = () => {
        setTimeout(() => setIsDragging(false), 0) // Small delay to ensure click event processes
    }

    const handleClick = () => {
        if(!isDragging){
            handlePic(data, index-1)
        }
    }

    function chooseImage(){
        switch (theme) {
            case 'purple':
                return vegetables_pink
            case 'black':
                return vegetables_green
            case 'blue':
                return vegetables_orange
            default:
              return vegetables_yellow
        }
    }

	return <>
        {(() => {
            switch (template) {
                case "salon":
                    return <div className="cell_salon_container">
                        <div className="cell_salon shadow_concav">
                            <div className="cell_info">
                                <h4>{translate({lang, info: data.table_name})} {data.table_id}</h4>
                                {data.table_type ? <p className="truncate">{translate({lang, info: data.table_type})}</p> : null}
                            </div>
                            <div className="cell_button">
                                <Button type="button" className="mybutton round button_transparent shadow_convex" onClick={()=>getItem(data)}>
                                    {translate({lang, info: "play"})}
                                </Button>
                            </div>
                        </div>
                    </div>
                case "market":
                    return <div className="cell_market_container">
                        <div className="cell_market shadow_concav">
                            <div className="cell_info">
                                <div className="crop_vegetables">
                                    <img alt="vegetable" className={'vegetable '+data.id} src={chooseImage()} />
                                </div>
                                <h4>{data["name_" + lang.toLowerCase()] || data.name_eng.toLowerCase()}</h4>
                                <p>{translate({lang, info: "value"})}: {data.value} <FontAwesomeIcon icon={faCarrot} /></p>
                                <p>{translate({lang, info: "price"})}: {convertCurrency(data.price, currency, exchange_rates)} {currency}</p>
                                <Counter min={0} max={100} update={(e)=>updateQtyMarket(e)} />
                            </div>
                            <div className="cell_button">
                                <Button type="button" className="mybutton round button_transparent shadow_convex" onClick={()=>getItem(data)}>
                                    <FontAwesomeIcon icon={faBasketShopping} />
                                </Button>
                            </div>
                        </div>
                    </div>
                case "race":
                    return <div className={"rabbit_box_container " + index} key={index}>
                        <div className="rabbit_box shadow_concav">
                            <Row>
                                <Col sm={6}>
                                    <div className="rabbit_box_pic">
                                        <div className={"rabbit_box_nr shadow_convex "+data.color}>{index}</div>
                                        <div className="box_pic shadow_convex">	
                                            <img src={data.img} alt={data.breed} />																			
                                        </div>															
                                    </div>
                                    <div className="rabbit_box_name shadow_convex"><h3>{data.name}</h3></div> 
                                </Col>
                                <Col sm={6}>
                                    <div className="rabbit_box_info">
                                        <p><span>{translate({lang, info: "breed"})}: </span>{data.breed}</p>
                                        <p><span>{translate({lang, info: "health"})}: </span>{data.health}</p>
                                        <Stars score={data.health} max={data.health_max} theme={theme}/>
                                    </div>
                                    <div className="rabbit_box_bet">
                                        <p>{translate({lang, info: "bet"})}:</p>
                                        <Counter min={0} num={0} max={max_bet} update={(e)=>updateRaceBet(e)} />
                                    </div>
                                    <div className="rabbit_box_place">
                                        <DropdownButton title={titleDropdown} id="language_button" onSelect={(e)=>handleDropdown(e, index)}>
                                            <Dropdown.Item eventKey={1}>{translate({lang, info: 'place_01'})}</Dropdown.Item>
                                            <Dropdown.Item eventKey={2}>{translate({lang, info: 'place_02'})}</Dropdown.Item>
                                            <Dropdown.Item eventKey={3}>{translate({lang, info: 'place_03'})}</Dropdown.Item>
                                        </DropdownButton>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                case "profile":
                    let show = '' 
                    let min_free = finances.min_free ? finances.min_free : 1000
                    if(!data.free && money < min_free && account_type === 1){
                        show = ' grey_image'
                    }                    
                    let style = ''
                    if(index-1 === selected){
                        style = ' selected'
                    }
                    return <div 
                        className={"crop_profile_pic_box" + style}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onClick={handleClick}
                    >
                    <div className="crop_profile_pic shadow_convex">
                        <img alt="profile_pic" className={"profile_pic pic_"+data.id+show} src={profilePic}/>
                    </div>										
                    <p>{data["name_" + lang.toLowerCase()] || data.name_eng.toLowerCase()}</p>
                </div>
                default:
                    return <div key={index}>{translate({lang, info: "error"})}</div>
            }
        })()}
    </>
}

export default Cell