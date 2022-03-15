import React from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {game_visible} from '../../actions/actions'
import under_construction_icon from '../../img/icons/under_construction_icon.png'

var dispatch;
function handleBack(text="game") {
    dispatch(game_visible(text))
}

function Questions(props){
    dispatch = props.dispatch;
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
                    <QuestionsList handleBack={handleBack} user_id={props.user_id} user={props.user} socket={props.socket} lang={props.lang}></QuestionsList>
                </Col>
                <Col sm={2}></Col>
            </Row>
        </>
	);
}

class QuestionsList extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
            user_id: props.user_id,
            user: props.user,
            lang: props.lang,
            list: [],
            header: [],
            loaded: false,
            socket: props.socket,
            width: window.innerWidth,
            handleBack: props.handleBack,
		};
        this.handleDropdown = this.handleDropdown.bind(this);
        this.handleExit = this.handleExit.bind(this);
        this.questionsData = this.questionsData.bind(this);
	}
    componentDidMount(){
        let self = this
        self.questionsData()
			.then(res => {
                self.setState({ loaded: true }); 
			})
			.catch(err => console.log(err));
    }

    questionsData(){
        let self = this
		return new Promise(function(resolve, reject){
            self.state.socket.emit('questions_send', {user_id: self.state.user_id, user: self.state.user});
            self.state.socket.on('questions_read', function(data){
                self.setState({ list: data });
                let header = [];
                for(let i in data){
                    header.push(data[i].answer);              
                }
                self.setState({ header: header });
                resolve(true);
            });
		});
	};

    handleExit(){
        this.state.handleBack('game');
    }
    handleDropdown(x){
        $('.answer_container').removeClass('open')
		$('.answer_container').each(function() {
			if($(this).attr('box') === x.toString()){
				$(this).addClass('open');
			}
		});
    }
	render() {
		return (
			<>
                {(() => {
                    if(this.state.loaded){
                        if(this.state.header.length>0 && this.state.list.length>0){
                            let self = this;
                            return(
                                <div className="question_container">
                                    {
                                        self.state.list.map(function(item, i){
                                            let question = item.question;
                                            let answer = item.answer;
                                            return(
                                                <div key={i} className="question_box">
                                                    <div className="question_container">
                                                        <div className="capitalize question_title shadow_convex" onClick={()=>self.handleDropdown(i)}>{question}</div>
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
                                <img className="under_construction_icon" alt="under construction" src={under_construction_icon} />
                            );
                        }
                    } else {
                        return(
                            <div>Loading...</div>
                        );
                    }
                })()}
                <p id="exit_salon" className="shadow_convex" onClick={() => this.handleExit()}>Exit salon</p>
            </>
		);
	}
}

function mapStateToProps(state) {	
	return { ...state }
}

export default connect(mapStateToProps)(Questions)