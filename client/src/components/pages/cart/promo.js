import React, {useState, useEffect} from 'react'
import { translate } from '../../../translations/translate'
import { isEmpty } from '../../../utils/utils'
import { Button } from 'react-bootstrap'

function Promo(props){
    const {settings, socket} = props
    const {lang} = settings
    const [value, setValue] = useState('')
    const [coupon, setCoupon] = useState(null)

    function handleClick(){
        if(!isEmpty(value)){
            socket.emit('promo_send', value)
        }
    }

    function updateInputValue(e){
        setValue(e.target.value)
    }

    useEffect(() => {
		socket.on('promo_read', (res)=>{
			setCoupon(res)
            setTimeout(()=>{
                setCoupon(null)
            }, 3000)
            if(res && typeof props.updatePromo === "function"){
                props.updatePromo(res)
            }
		})
	}, [socket])

    return <div id="cart_promo" className="cart_box shadow_concav">
        <h4>{translate({lang: lang, info: "promo_code"})}</h4>
        <form className="form-inline">
            <input className="input_light shadow_concav" type="text" placeholder="COUPON" onChange={(e)=>{updateInputValue(e)}}/>
            <Button 
                type="button"  
                className="mybutton button_transparent shadow_convex remove"
                onClick={()=>{handleClick()}}
            ><span>{translate({lang: lang, info: "apply_coupon"})}</span></Button>
            {(() => {
                if(!isEmpty(coupon)){
                    if(Object.keys(coupon).length>0){
                        return <p className="alert alert-success">
                            {(() => {
                                switch (lang) {
                                    case "DE":
                                        return <span>{coupon.discount}% Rabatt</span>
                                    case "ES":
                                        return <span>Descuento del {coupon.discount}%</span>
                                    case "FR":
                                        return <span>Remise de {coupon.discount}%</span>
                                    case "IT":
                                        return <span>Sconto del {coupon.discount}%</span>
                                    case "RO":
                                        return <span>Reducere de {coupon.discount}%</span>
                                    case "ENG":
                                    default:
                                        return <span>{coupon.discount}% discount</span>
                                } 
                            })()}
                        </p>
                    } else {
                        return <p className="alert alert-danger"><span>{translate({lang: lang, info: "coupon_not_valid"})}</span></p>
                    }
                } else {
                    return 
                }
            })()}
        </form>
    </div>
}
export default Promo