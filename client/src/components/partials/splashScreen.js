import React, {useState, useEffect} from 'react'
import logo_splash from '../../img/logo.png'
import TransparentText from './transparentText'
import { getWindowDimensions } from '../../utils/utils'

function Splash(props) {
    const [height, setHeight] = useState(getHeightBasedOnWidth(getWindowDimensions().width))

    function getHeightBasedOnWidth(width){
        if(width >= 960){
          return 72
        } else if (width >= 600) {
          return 50
        } else {
          return 30
        }
    }

    function handleResize(){
        setHeight(getHeightBasedOnWidth(getWindowDimensions().width))
    }

    useEffect(() => {    
        if(typeof window !== "undefined"){
            window.addEventListener("resize", handleResize)
            handleResize()
            return () => window.removeEventListener("resize", handleResize)
        }
	}, [])

	return <div id="splash_screen">
        <div className="splash_screen_container">
            <div className="content_box">
                <img id="logo_splash" alt="logo_splash" src={logo_splash} />
                <div className="content-dot">
                    <div className="content">
                        <h1 className="splash_title">
                            <TransparentText text={"BunnyBet"} height={height} size={height} />
                        </h1>
                    </div>
                </div>
                <div className="progress_container">
                    <div className="progress_box_container">
                        <div className="progress_box">
                            <div className="progress" style={{width: props.progressNumber + '%'}}></div>
                        </div>
                    </div>
                    <div className="progress_text" style={{width: props.progressNumber + '%'}}>
                        <span>{props.progressNumber} %</span>
                    </div>
                </div>
            </div>
            
            <div className="main-diamond-outer">
                <div className="main-diamond-inner"></div>
            </div>
            
            <div className="mid-diamond-left"></div>
            <div className="mid-diamond-right"></div>

            <div className="small-diamond-left-top"></div>
            <div className="small-diamond-left-bottom"></div>
            <div className="small-diamond-right-top"></div>
            <div className="small-diamond-right-bottom"></div>

            <div className="small-diamond-1"></div>
            <div className="small-diamond-2"></div>
            <div className="small-diamond-3"></div>
            <div className="small-diamond-4"></div>
        </div>
    </div>	
}

export default Splash