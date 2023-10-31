import React, {useState} from 'react'
import { translate } from '../../translations/translate'
import Counter from '../partials/counter'
import Stars from '../rating/stars'
import { useDispatch, useSelector } from 'react-redux'
import { changeRaceBets } from '../../reducers/games'
import { Button, Row, Col } from 'react-bootstrap'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import { decryptData } from '../../utils/crypto'

function Cell(props) {
    const {lang, index, data, template} = props
    const [qty, setQty] = useState(1)
    let place = translate({lang: lang, info: 'place'})
    const [titleDropdown, setTitleDropdown] = useState(place)
    let dispatch = useDispatch()
    let user = useSelector(state => state.auth.user)
    let max_bet = decryptData(user.money)

    function updateQtyMarket(x){
        setQty(x)
    }

    function updateRaceBet(x){
        dispatch(changeRaceBets({id: data.id, bet: x}))
    }

    function handleDropdown(x){
        dispatch(changeRaceBets({id: data.id, place: x}))
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

	return <>
        {(() => {
            switch (template) {
                case "salon":
                    let table_type = data.table_type
                    if(table_type){
                        table_type=table_type.split('_').join(' ')
                    }
                    return <div className="cell_salon_container">
                        <div className="cell_salon shadow_concav">
                            <div className="cell_info">
                                <h4>{data.table_name} {data.table_id}</h4>
                                {table_type ? <p>{table_type}</p> : null}
                            </div>
                            <div className="cell_button">
                                <Button 
                                    type="button"  
                                    className="mybutton round button_transparent shadow_convex"
                                    table_name={data.table_name}
                                    table_type={data.table_type}
                                    table_id={data.table_id}
                                >{translate({lang: lang, info: "Click"})}</Button>
                            </div>
                        </div>
                    </div>
                case "market":
                    let price = data.price
                    return <div className="cell_market_container">
                        <div className="cell_market shadow_concav">
                            <div className="cell_info">
                                {(() => {
                                    switch (props.lang) {
                                        case "DE":
                                            return <h4>{data.name_de}</h4>
                                        case "ES":
                                            return <h4>{data.name_es}</h4>
                                        case "FR":
                                            return <h4>{data.name_fr}</h4>
                                        case "IT":
                                            return <h4>{data.name_it}</h4>
                                        case "RO":
                                            return <h4>{data.name_ro}</h4>
                                        case "ENG":
                                        default:
                                            return <h4>{data.name_eng}</h4>
                                    } 
                                })()}
                                <p>{translate({lang: lang, info: "price"})}: {price}</p>
                                <Counter update={(e)=>updateQtyMarket(e)}></Counter>
                            </div>                            
                            <div className="cell_button">
                                <Button 
                                    type="button"  
                                    className="mybutton round button_transparent shadow_convex"
                                    market_qty={qty}
                                    market_id={data.id}
                                >{translate({lang: lang, info: "buy"})}</Button>
                            </div>
                        </div>
                    </div>
                case "race":
                    return <div className="rabbit_box_container" key={index}>
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
                                        <p><span>{translate({lang: lang, info: "breed"})}: </span>{data.breed}</p>
                                        <p><span>{translate({lang: lang, info: "delay"})}: </span>{data.delay}</p>
                                        <p><span>{translate({lang: lang, info: "health"})}: </span>{data.health}</p>
                                        <Stars score={data.health} max={data.health_max}></Stars>
                                    </div>
                                    <div className="rabbit_box_bet">
                                        <p>{translate({lang: lang, info: "bet"})}:</p>
                                        <Counter num={0} max={max_bet} update={(e)=>updateRaceBet(e)}></Counter>
                                    </div>
                                    <div className="rabbit_box_place">
                                        <DropdownButton title={titleDropdown} id="language_button" onSelect={(e)=>handleDropdown(e)}>
                                            <Dropdown.Item eventKey={1}>{translate({lang: lang, info: 'place_01'})}</Dropdown.Item>
                                            <Dropdown.Item eventKey={2}>{translate({lang: lang, info: 'place_02'})}</Dropdown.Item>
                                            <Dropdown.Item eventKey={3}>{translate({lang: lang, info: 'place_03'})}</Dropdown.Item>
                                        </DropdownButton>
                                    </div>                                
                                </Col>
                            </Row>
                        </div>
                    </div>
                default:
                    return <div key={index}>{translate({lang: lang, info: "error"})}</div>
            }
        })()}
        
    </>
}

export default Cell