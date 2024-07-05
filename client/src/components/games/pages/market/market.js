import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import shop from '../../../../img/other/shop.png'
import Carousel from '../../../carousel/carousel'
import { useDispatch } from 'react-redux'
import { cartAdd } from '../../../../reducers/cart'
import { Button } from 'react-bootstrap'
import { changePage, changeGame, changeGamePage } from '../../../../reducers/page'
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faCartShopping, faUser, faArrowRotateLeft} from '@fortawesome/free-solid-svg-icons'

function Market(props){
    const {home} = props
    let market = home.market ? home.market : []
	let shader_style = {backgroundImage: `url(${shop})`}
    const market_carousel_options = {
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        swipeToSlide: true,
        draggable: true,
        dots: false,
        arrows: false,
        initialSlide: 0,
        swipeThreshold: 20,
        responsive: [
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 4,
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                }
            }, 
            {
                breakpoint: 960,
                settings: {
                    slidesToShow: 2,
                }
            }, 
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                }
            },           
        ]
    }
    let dispatch = useDispatch()
    
    function marketChoice(x){
        dispatch(cartAdd(x))
    }

    function handleGoTo(x){
        switch (x) {
            case "user":
                dispatch(changePage('Salon'))
                dispatch(changeGame(null))
                dispatch(changeGamePage('dashboard'))
                break 
            case "cart":
                dispatch(changePage('Cart'))
                dispatch(changeGame(null))
                dispatch(changeGamePage(null))
                break
            case "back":
            default:
                dispatch(changePage('Salon'))
                dispatch(changeGame(null))
                dispatch(changeGamePage(null))
                break
		}        
    }

    return <div className="market_container">        
        <Row>
            <Col sm={2} />
            <Col sm={8}><div style={shader_style} className="shop_shader"></div></Col>
            <Col sm={2} />
        </Row>
        <Row className="item_container">
            <Col sm={2} />
            <Col sm={8} style={{textAlign:"center"}}>
                <Carousel 
                    {...props}
                    id="carousel_market"
                    template="market" 
                    options={market_carousel_options}
                    itemList={market} 
                    getItem={(e)=>marketChoice(e)}
                />
            </Col>
            <Col sm={2} />
        </Row>
        <Row>
            <Col sm={12} className="button_action_group">
                <Button type="button" onClick={()=>handleGoTo('cart')} className="mybutton round button_transparent shadow_convex">
                    <FontAwesomeIcon icon={faCartShopping}/>
                </Button>
                <Button type="button" onClick={()=>handleGoTo('user')} className="mybutton round button_transparent shadow_convex">
                    <FontAwesomeIcon icon={faUser}/>
                </Button>
                <Button type="button" onClick={()=>handleGoTo('back')} className="mybutton round button_transparent shadow_convex">
                    <FontAwesomeIcon icon={faArrowRotateLeft} />
                </Button>	
            </Col>
        </Row>
    </div>
}
export default Market