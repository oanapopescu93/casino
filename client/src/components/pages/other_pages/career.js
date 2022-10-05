import React, { useEffect, useState } from 'react'
import $ from 'jquery'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {game_visible} from '../../actions/actions'
import { sort } from '../../utils'

function Career(props){
    let lang = props.lang
    let dispatch = props.dispatch

    function handleBack() {
        if(dispatch){
            dispatch(game_visible("game"))
        }
    }

	return (
        <>
            <Row>
                <Col sm={12}>
                    <h2>{lang === "ro" ? <span>Cariera</span> : <span>Career</span>}</h2>
                </Col>
            </Row>
            <Row>
                <Col sm={2}></Col>
                <Col sm={8}>
                    <CareerList handleBack={handleBack} info={props.info} lang={lang}></CareerList>
                </Col>
                <Col sm={2}></Col>
            </Row>
        </>
	)
}

function CareerList(props){
    let lang = props.lang
    const [list, setList] = useState([])
    const [header, setHeader] = useState([])
    const [filter, setFilter] = useState([])

    useEffect(() => {
        let list = props.info.career
        list = sort(list, "type")
        let header = []
        let type = ""

        for(let i in list){
            if(type !== list[i].type){
                type = list[i].type
                header.push(type)
            }                                    
        }
        if(header.length>0){
            header = ['all'].concat(header)
        }
        list = sort(list, "title")

        setList(list)
        setHeader(header)
        setFilter(filter)
	}, [])

    function handleExit(){
        props.handleBack('game')
    }
    function handleDropdown_small(x){
        $('.career_header_title_box_container').toggleClass('open')
        if($('.career_header_title_box_container').hasClass('open')){
            $('.career_header_title i').removeClass('fa-angle-down')
            $('.career_header_title i').addClass('fa-angle-up')
        } else {
            $('.career_header_title i').addClass('fa-angle-down')
            $('.career_header_title i').removeClass('fa-angle-up')
        }
    }
    function handleDropdown(x){
        $('.career_header_box').removeClass('open')
        $('#career_header_box_'+x).addClass('open')
        
        if(x !== "all"){
            list = sort(list, "type")
            list = list.filter(function(elem){
                return elem.type === x
            })
            this.setState({ filter: list })
        } else {
            list = sort(list, "title")
            this.setState({ filter: list })
        }
    }
	
    return (
        <>
            {(() => {
                    if(filter && header){
                        if(filter.length>0 && header.length>0){
                            return(
                                <>
                                    <div className="career_header_container">
                                        {(() => {
                                            if (header.length>0) {
                                                if (window.innerWidth < 960) {
                                                    return(
                                                        <>
                                                            <div id="career_header_title_dropdown_container">
                                                                <div className="career_header_title_container" onClick={()=>handleDropdown_small()}>
                                                                    <div className="capitalize career_header_title shadow_convex">
                                                                        <span className="capitalize">all</span>
                                                                        <i className="fa fa-angle-down"></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="career_header_title_box_container">
                                                                <div className="career_header_title_box">
                                                                    {
                                                                        header.map(function(item0, t){
                                                                            return(
                                                                                <div key={t} className="capitalize"  onClick={()=>handleDropdown(item0)}>{item0}</div>
                                                                            )
                                                                        })
                                                                    }
                                                                </div>
                                                            </div>  
                                                        </>
                                                    )
                                                } else {
                                                    return(
                                                        <>
                                                            {
                                                                header.map(function(item0, t){
                                                                    if(t === 0){
                                                                        return(
                                                                            <div key={t} id={'career_header_box_'+item0} className="capitalize career_header_box open"  onClick={()=>handleDropdown(item0)}>{item0}</div>
                                                                        )
                                                                    } else {
                                                                        return(
                                                                            <div key={t} id={'career_header_box_'+item0} className="capitalize career_header_box"  onClick={()=>handleDropdown(item0)}>{item0}</div>
                                                                        )
                                                                    }
                                                                })
                                                            }
                                                        </>
                                                    )
                                                }                                                    
                                            }
                                        })()}   
                                    </div>
                                    <div className="career_container">
                                        <div className="career_scroll">
                                            {(() => {
                                                if(filter.length>0){
                                                    return(
                                                        <>
                                                            {
                                                                filter.map(function(item, i){
                                                                    let requirements = item.requirements
                                                                    let responsabilities = item.responsabilities
                                                                    return(
                                                                        <div className="career_box" key={i}>
                                                                            <div className="career_info career_title"><span><b>Title: </b></span><span>{item.title}</span></div>
                                                                            <div className="career_info career_location"><span><b>Location: </b></span><span>{item.location}</span></div>
                                                                            <div className="career_info career_requirements">
                                                                                <span><b>Requirements: </b></span>
                                                                                <ul>
                                                                                    {
                                                                                        requirements.map(function(item1, j){
                                                                                            return(
                                                                                                <li key={j}>{item1}</li>
                                                                                            )
                                                                                        })
                                                                                    }
                                                                                </ul>
                                                                            </div>
                                                                            <div className="career_info career_responsabilities">
                                                                                <span><b>Responsabilities: </b></span>
                                                                                <ul>
                                                                                    {
                                                                                        responsabilities.map(function(item2, k){
                                                                                            return(
                                                                                                <li key={k}> {item2}</li>
                                                                                            )
                                                                                        })
                                                                                    }
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </>
                                                    )
                                                }
                                            })()}
                                        </div>
                                    </div>
                                </>
                            )
                        } else {
                            if(lang === "ro"){
                                return <p>Nu exista joburi disponibile inca.</p>
                            } else {
                                return <p>No jobs available yet.</p>
                            }
                        }
                    } else {
                        return <p>Loading...</p>
                    }
            })()}
            <p id="exit_salon" className="shadow_convex" onClick={() => handleExit()}>Exit salon</p>
        </>
    )
}

export default Career