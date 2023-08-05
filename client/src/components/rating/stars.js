import React from 'react'
import star_full from '../../img/icons_other/rating/star_full.png'
import star_half from '../../img/icons_other/rating/star_half.png'
import star_empty from '../../img/icons_other/rating/star_empty.png'

function Stars(props){
    let score = parseInt(props.score)
    let max = parseInt(props.max)
    let stars = []
    for(let i =1; i<=max; i++){
        let x = parseInt(i)
        let t = Math.floor(score)  
        if(x<score){
            stars.push(2)
        } else {
            if(x<=t){
                stars.push(1)
            } else {
                stars.push(0)
            }
        }        
    }
	return <div className="stars">
        {stars.map(function(item, i){
            switch(item) {
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