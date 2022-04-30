import React from 'react';

function Stars(props){
    let score = parseInt(props.score);
    let max = parseInt(props.max);
    let stars = [];
    for(let i =1; i<=max; i++){
        let x = parseInt(i);
        let t = Math.floor(score);   
        if(x<score){
            stars.push("fa-star");
        } else {
            if(x<=t){
                stars.push("fa-star-half-o");
            } else {
                stars.push("fa-star-o");
            }
        }        
    }
	return (
		<div className="stars_container">
            {
                stars.map(function(item, i){
                    return(
                        <i key={i} className={"fa "+item}></i>
                    )
                })
            }
		</div>
	);
}

export default Stars;