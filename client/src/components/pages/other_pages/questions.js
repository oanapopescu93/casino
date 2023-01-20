import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import $ from 'jquery'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {game_visible} from '../../actions/actions'

function Questions(props){
    let dispatch = useDispatch()
    function handleBack() {
        if(dispatch){
            dispatch(game_visible("game"))
        }
    }
	return (
        <>
            <Row>
                <Col sm={12}>
                    <h2>{props.lang === "ro" ? <span>Intrebari</span> : <span>Questions</span>}</h2>
                </Col>
            </Row>
            <Row>
                <Col sm={2}></Col>
                <Col sm={8}>
                    <QuestionsList handleBack={()=>handleBack()} info={props.info} lang={props.lang}></QuestionsList>
                </Col>
                <Col sm={2}></Col>
            </Row>
        </>
	)
}

function QuestionsList(props){
    let lang = props.lang
    const [list, setList] = useState([])
    const [header, setHeader] = useState([])

    useEffect(() => {
        setList(props.info.questions[0][lang])
        let header = []
        for(let i in props.info.questions[0][lang]){
            header.push(props.info.questions[0][lang][i].answer)             
        }
        setHeader(header)
	}, [lang])

    function handleExit(){
        props.handleBack('game')
    }

    function handleDropdown(x){
        $('.answer_container').removeClass('open')
		$('.answer_container').each(function() {
			if($(this).attr('box') === x.toString()){
				$(this).addClass('open')
			}
		})
    }
	
    return (
        <>
            {(() => {
                if(header.length>0 && list.length>0){
                    return(
                        <div className="question_container">
                            {
                                list.map(function(item, i){
                                    let question = item.question
                                    let answer = item.answer
                                    return(
                                        <div key={i} className="question_box">
                                            <div className="question_container">
                                                <div className="capitalize question_title shadow_convex" onClick={()=>handleDropdown(i)}>{question}</div>
                                            </div>
                                            {(() => {
                                                if(i === 0){
                                                    return(
                                                        <div box={i} className="answer_container open">
                                                            {answer}
                                                        </div>
                                                    )
                                                } else {
                                                    return(
                                                        <div box={i} className="answer_container">
                                                            {answer}
                                                        </div>
                                                    )
                                                }
                                            })()}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                } else {
                    return(
                        <div>{lang === "ro"? <span>Nu exista date</span> : <span>No data</span>}</div>
                    )
                }
            })()}
            <p id="exit_salon" className="shadow_convex" onClick={() => handleExit()}>{lang === "ro"? <span>Inapoi</span> : <span>Back</span>}</p>
        </>
    )
}

export default Questions