import React, { useState, useEffect } from 'react'
import KenoBalls from './kenoBalls'
import KenoTube from './kenoTube'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faArrowRotateLeft} from '@fortawesome/free-solid-svg-icons'

function KenoAnimation(props){
    const [array, setArray] = useState([])

    useEffect(() => {
        setArray(props.kenoSpotsResult)
    }, [props.kenoSpotsResult])

    function handleBack(){
        if(typeof props.animationFinished === "function"){
            props.animationFinished("balls")
        }
    }

    return <>
        {array && array.length > 0 ? <>
            <div className="keno_animation_tube">
                <KenoTube {...props} />
            </div>
            <div className="keno_animation_balls">
                <KenoBalls {...props} />
            </div>
        </> : <>
            <Button 
                type="button"  
                className="mybutton round button_transparent shadow_convex"
                onClick={()=>{handleBack()}}
            ><FontAwesomeIcon icon={faArrowRotateLeft} /></Button>
        </>}
    </>
}

export default KenoAnimation