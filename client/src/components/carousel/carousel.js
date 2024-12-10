/* eslint-disable react/display-name */

import React, {forwardRef, useImperativeHandle, useState} from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Cell from './cell'

const CarouselComponent = forwardRef((props, ref) => {
    const {id, options, itemList} = props

    const [rabbits, rabbitsSet] = useState([])

    useImperativeHandle(ref, () => ({
		getRabbits: () => {            
            return rabbits
        }
	}), [rabbits])

    function getRabbitsInfo(data){
        let array = [...rabbits]
        let bet = data.bet ? parseInt(data.bet): 0	
        let place = parseInt(data.place)		
        const item = array.find((x) => x.id === data.id)
        if (item) {	
            if(bet){
                item.bet = bet  
            }
            if(place){
                item.place = place  
            }
        } else {
            array.push({ ...data, bet: bet, raceId: array.length })
        }
        rabbitsSet(array)
    }

    return <div id={id}>
        <Slider {...options}>
            {itemList.map((item, i) => (
                <div key={i} className='item'>
                    <Cell index={i + 1} data={item} {...props} getRabbitsInfo={(e)=>getRabbitsInfo(e)}/>
                </div>
            ))}
        </Slider>
    </div>
})

export default CarouselComponent