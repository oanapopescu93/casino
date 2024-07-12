import React from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Cell from './cell'

function CarouselComponent(props){ 
    const {id, options, itemList} = props
    return <div id={id}>
        <Slider {...options}>
            {itemList.map((item, i) => (
                <div key={i} className='item'>
                    <Cell index={i + 1} data={item} {...props} />
                </div>
            ))}
        </Slider>
</div>
}

export default CarouselComponent