import React, {useEffect, useState} from 'react'
import { ReactComponent as Bitcoin } from '../../../img/icons/bitcoin-love-heart.svg'

function ButtonDonation(props){
    const [open, setOpen] = useState("")

    useEffect(() => {
        setTimeout(()=>{
            setOpen("open")
        }, 500)
	}, [])
    
    function handleClick(){
        if(typeof props.handleDonationClick === "function"){
            props.handleDonationClick()
        }
    }

	return <div id="donate" className={open} onClick={()=>handleClick()}><Bitcoin /></div>
}
export default ButtonDonation