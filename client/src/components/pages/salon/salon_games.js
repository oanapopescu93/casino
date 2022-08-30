import React, {useEffect, useState } from 'react';
import $ from 'jquery';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Carousel from '../partials/carousel'
import { setCookie } from '../../utils';
import { useDispatch } from 'react-redux'
import { game_page } from '../../actions/actions';

function SalonGames(props){
	let info = props.info;
    let socket = info.socket;
    let lang = info.lang;
    const [width, setWidth] = useState(window.innerWidth);
    let dispatch = useDispatch();		

    useEffect(() => {
		dispatch(game_page('salon'));
        $(window).resize(function(){            
			setWidth(window.innerWidth);
		});
	}, []); 

    function handleExit(){
        setCookie("casino_user", '');
		setCookie("casino_email", '');
		let url = window.location.href;
		url = url.split('/salon');
		window.location.href = url[0];
	}

    function handleDropdown(t) {
		$('.casino_games_table_container').removeClass('open')
		$('.casino_games_table_container').each(function() {
			if($(this).attr('box') === t){
				$(this).addClass('open');
                let title = t.split('_').join(' ');
                $('.casino_games_title span').text(title);
                $('.casino_games_title_box_container').removeClass('open')
			}
		});
	}

    function handleDropdown_small() {
		$('.casino_games_title_box_container').toggleClass('open');
        if($('.casino_games_title_box_container').hasClass('open')){
            $('.casino_games_title i').removeClass('fa-angle-down');
            $('.casino_games_title i').addClass('fa-angle-up');
        } else {
            $('.casino_games_title i').addClass('fa-angle-down');
            $('.casino_games_title i').removeClass('fa-angle-up');
        }
	}
	
	return (
        <>
            <Row>
                <Col sm={2}></Col>
                <Col sm={8}>
                {(() => {
                    if (width < 960) {
                        $('.casino_games_table_container').removeClass('open');
                        $('.casino_games_table_container').eq(0).addClass('open')
                        return (
                            <div id="casino_games_title_dropdown_container">
                                <div onClick={()=>handleDropdown_small()} className="casino_games_title_container">
                                    <div className="capitalize casino_games_title shadow_convex">
                                        <span className="capitalize">roulette tables</span>
                                        <i className="fa fa-angle-down"></i>
                                    </div>
                                </div>                                
                                <div className="casino_games_title_box_container">
                                    <div className="casino_games_title_box">
                                        {
                                            info.casino_games_title.map(function(t, i){
                                                let title = t.split('_').join(' ');
                                                return(
                                                    <div key={i} className="capitalize" onClick={()=>handleDropdown(t)}>{title}</div>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    } 
                })()}
                </Col>
                <Col sm={2}></Col>
            </Row>
            <Row>
                <Col sm={2}></Col>
                <Col sm={8}>
                    {
                        info.casino_games_title.map(function(t, i){
                            var title = t.split('_')[0];
                            var box = "casino_games_table_container";
                            if(i === 0){
                                box = box + " open"
                            }

                            return(
                                <div key={i}>
                                    {(() => {
                                        if (width > 960) {
                                            return (
                                                <div className="casino_games_title_container">
                                                    <div className="capitalize casino_games_title shadow_convex" onClick={()=>handleDropdown(t)}>{title}</div>
                                                </div>
                                            )
                                        }
                                    })()}                                    
                                    <div box={t} className={box}>
                                        <div className="casino_games_table">
                                            {(() => {
                                                if (info.casino_games[t].length === 0) {
                                                    return (
                                                        <div><p>Loading...</p></div>
                                                    )
                                                } else {
                                                    return (
                                                        <Carousel template="salon" lang={lang} socket={socket} item_list={info.casino_games[t]}></Carousel>
                                                    )
                                                }
                                            })()}
                                        </div>
                                    </div>	
                                </div>													
                            )
                        })
                    }
                </Col>
                <Col sm={2}></Col>
            </Row>
            <Row>
                <Col sm={12}>
                    {lang === "ro" ? 
                        <p id="exit_salon" className="shadow_convex" onClick={() => handleExit()}>Iesi din salon</p> : 
                        <p id="exit_salon" className="shadow_convex" onClick={() => handleExit()}>Exit salon</p>	
                    }																			
                </Col>
            </Row>	
        </>
	);
}

export default SalonGames;