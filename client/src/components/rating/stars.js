import React from 'react'
import star_full from '../../img/icons_other/rating/star_full.png'
import star_half from '../../img/icons_other/rating/star_half.png'
import star_empty from '../../img/icons_other/rating/star_empty.png'

function Stars(props) {
    const { score, max } = props

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
    
    return <div className="stars">
        {stars.map((item, i) => {
            switch (item) {
                case 2:
                    return <img key={i} src={star_full} alt="star_full" className="star" />
                case 1:
                    return <img key={i} src={star_half} alt="star_half" className="star" />
                default:
                    return <img key={i} src={star_empty} alt="star_empty" className="star" />
            }
        })}
    </div>
}

export default Stars