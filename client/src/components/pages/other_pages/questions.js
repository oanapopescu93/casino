import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux'
import $ from 'jquery';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {game_visible} from '../../actions/actions'

function Questions(props){
    let dispatch = useDispatch();
    function handleBack() {
        if(dispatch){
            dispatch(game_visible("game"))
        }
    }
	return (
        <>
            <Row>
                <Col sm={12}>
                    <h2>{props.info.lang === "ro" ? <span>Intrebari</span> : <span>Questions</span>}</h2>
                </Col>
            </Row>
            <Row>
                <Col sm={2}></Col>
                <Col sm={8}>
                    <QuestionsList handleBack={()=>handleBack()} info={props.info}></QuestionsList>
                </Col>
                <Col sm={2}></Col>
            </Row>
        </>
	);
}

function QuestionsList(props){
    let user_id = props.info.user_id;
    let user_uuid = props.info.user_uuid;
    let user = props.info.user;
    let lang = props.info.lang;
    let socket = props.info.socket;
    const [list, setList] = useState([]);
    const [header, setHeader] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        questionsData().then(res => {
            setLoaded(true);
        }).catch(err => console.log('question page error--> ', err));
	}, []);

    function questionsData(){
		return new Promise(function(resolve, reject){
            socket.emit('questions_send', {user_id: user_id, user_uuid: user_uuid, user: user});
            socket.on('questions_read', function(data){
                setList(data);
                let header = [];
                for(let i in data){
                    header.push(data[i].answer);              
                }
                setHeader(header);
                resolve(true);
            });
		});
	};

    function handleExit(){
        props.handleBack('game');
    }

    function handleDropdown(x){
        $('.answer_container').removeClass('open')
		$('.answer_container').each(function() {
			if($(this).attr('box') === x.toString()){
				$(this).addClass('open');
			}
		});
    }
	
    return (
        <>
            {(() => {
                if(loaded){
                    if(header.length>0 && list.length>0){
                        return(
                            <div className="question_container">
                                {
                                    list.map(function(item, i){
                                        let question = item.question;
                                        let answer = item.answer;
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
                                                        );
                                                    } else {
                                                        return(
                                                            <div box={i} className="answer_container">
                                                                {answer}
                                                            </div>
                                                        );
                                                    }
                                                })()}
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        );
                    } else {
                        return(
                            <div>{lang === "ro"? <span>Nu exista date</span> : <span>No data</span>}</div>
                        );
                    }
                } else {
                    return(
                        <div>Loading...</div>
                    );
                }
            })()}
            <p id="exit_salon" className="shadow_convex" onClick={() => handleExit()}>{lang === "ro"? <span>Inapoi</span> : <span>Back</span>}</p>
        </>
    );
}

export default Questions;