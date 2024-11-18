import React from 'react'

import star_full_yellow from '../../img/icons_other/rating/star_full_yellow.png'
import star_half_yellow from '../../img/icons_other/rating/star_half_yellow.png'
import star_empty_yellow from '../../img/icons_other/rating/star_empty_yellow.png'

import star_full_pink from '../../img/icons_other/rating/star_full_pink.png'
import star_half_pink from '../../img/icons_other/rating/star_half_pink.png'
import star_empty_pink from '../../img/icons_other/rating/star_empty_pink.png'

import star_full_green from '../../img/icons_other/rating/star_full_green.png'
import star_half_green from '../../img/icons_other/rating/star_half_green.png'
import star_empty_green from '../../img/icons_other/rating/star_empty_green.png'

import star_full_orange from '../../img/icons_other/rating/star_full_orange.png'
import star_half_orange from '../../img/icons_other/rating/star_half_orange.png'
import star_empty_orange from '../../img/icons_other/rating/star_empty_orange.png'

function Stars(props) {
    const { score, max, theme } = props

    let stars = []
    const integerPart = Math.floor(score)
    const hasDecimal = score % 1 !== 0

    for (let i = 1; i <= max; i++) {
        if (i <= integerPart) {
            stars.push(2) // full star
        } else if (i === integerPart + 1 && hasDecimal) {
            stars.push(1) // half star
        } else {
            stars.push(0) // empty star
        }
    }

    function chooseImage(type){
        switch (theme) {
            case 'purple':
                switch (type) {
                    case "star_full":
                        return star_full_pink
                    case "star_half":
                        return star_half_pink
                    default:
                        return star_empty_pink
                }
            case 'black':
                switch (type) {
                    case "star_full":
                        return star_full_green
                    case "star_half":
                        return star_half_green
                    default:
                        return star_empty_green
                }
            case 'blue':
                switch (type) {
                    case "star_full":
                        return star_full_orange
                    case "star_half":
                        return star_half_orange
                    default:
                        return star_empty_orange
                }
            default:
                switch (type) {
                    case "star_full":
                        return star_full_yellow
                    case "star_half":
                        return star_half_yellow
                    default:
                        return star_empty_yellow
                }
        }        
    }
    
    return <div className="stars">
        {stars.map((item, i) => {
            switch (item) {
                case 2:
                    return <img key={i} src={chooseImage("star_full")} alt="star_full" className="star" />
                case 1:
                    return <img key={i} src={chooseImage("star_half")} alt="star_half" className="star" />
                default:
                    return <img key={i} src={chooseImage("star_empty")} alt="star_empty" className="star" />
            }
        })}
    </div>
}

export default Stars