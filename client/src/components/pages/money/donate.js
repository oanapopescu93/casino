import React, { useEffect } from 'react'
import $ from 'jquery'
import { useDispatch } from 'react-redux'
import { ReactComponent as Bitcoin } from '../../img/icons/bitcoin-love-heart.svg'
import { game_page } from '../../actions/actions'

function Donate(){
    const dispatch = useDispatch()

    useEffect(() => {
        setTimeout(function(){
            $('#donate').addClass("open")
        }, 500)
	}, [])
    
    function click_donate(){        
        dispatch(game_page('donation'))
    }

	return (
        <>
            <div id="donate" className="text-center" onClick={click_donate}>
                <Bitcoin></Bitcoin>
            </div>
        </>
	)
}

export default Donate