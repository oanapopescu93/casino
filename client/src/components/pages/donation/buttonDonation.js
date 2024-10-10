import React, {useEffect, useState} from 'react'
import { ReactComponent as Bitcoin } from '../../../img/icons/bitcoin-love-heart.svg'

function ButtonDonation(props){
    const {handleDonationClick} = props
    const [open, setOpen] = useState("")

    useEffect(() => {
        setTimeout(()=>{
            setOpen("open")
        }, 500)
	}, [])

	return <div id="donate" className={open} onClick={()=>handleDonationClick()}><Bitcoin /></div>
}
export default ButtonDonation