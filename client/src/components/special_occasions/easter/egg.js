import React from 'react'
import '../../css/easter_eggs.css'
function EasterEgg(props) {
return (		
        <div className="eggs">
                <div className="egg egg-left">
                        <div className="stripe"></div>
                        <div className="stripe"></div>
                        <div className="stripe"></div>
                        <div className="stripe"></div>
                        <div className="stripe"></div>
                </div>
                <div className="egg egg-right"></div>
        </div>
)
}
export default EasterEgg