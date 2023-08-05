import React, {useEffect} from 'react'
import OwlCarousel from 'react-owl-carousel'
import 'owl.carousel/dist/assets/owl.carousel.css'
import 'owl.carousel/dist/assets/owl.theme.default.css'
import List from './list'
import $ from "jquery"

function Carousel(props){    
    const {id, options} = props
    let carouselList = <List {...props}></List>

    useEffect(() => {
        if($('#'+id+' .cell_button button')){
            $('#'+id+' .cell_button button').click(function(e) {
                let payload = {}
                switch(id) {
                    case "carousel_market":
                        let id = $(e.target).attr('market_id')
                        let qty = $(e.target).attr('market_qty')
                        payload = {id, qty}
                        break
                    default: //carousel_salon
                        let table_name = $(e.target).attr('table_name')
                        let table_type = $(e.target).attr('table_type')
                        let table_id = $(e.target).attr('table_id')
                        payload = {table_name, table_type, table_id}
                }
                if(typeof props.getItem === "function"){
                    props.getItem(payload)
                }
            })
        }
    }, [carouselList])

    function handleSelect(e){
        if (e.item) {
            var index = e.item.index - 1
            var count = e.item.count
            if (index > count){
                index = 0
            }
            if (index <= 0){
                index = count
            }
            if(typeof props.getIndex === "function"){
                props.getIndex(index)
            }
        }
    }

    return <OwlCarousel id={id} className='owl-theme' {...options} ref={props.innerRef} onDragged={(e) => handleSelect(e)}>
        {carouselList}
    </OwlCarousel>
}

export default Carousel