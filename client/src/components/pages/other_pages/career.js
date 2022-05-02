import React from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {game_visible} from '../../actions/actions'
import { sort } from '../../utils';

var dispatch;
function handleBack(text="game") {
    dispatch(game_visible(text))
}

function Career(props){
    dispatch = props.dispatch;
	return (
        <>
            <Row>
                <Col sm={12}>
                    <h2>{props.lang === "ro" ? <span>Cariera</span> : <span>Career</span>}</h2>
                </Col>
            </Row>
            <Row>
                <Col sm={2}></Col>
                <Col sm={8}>
                    <CareerList handleBack={handleBack} user_id={props.user_id} user={props.user} socket={props.socket} lang={props.lang}></CareerList>
                </Col>
                <Col sm={2}></Col>
            </Row>
        </>
	);
}

class CareerList extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
            user_id: props.user_id,
            user: props.user,
            lang: props.lang,
            header: [],
            list: [],
            filter_list: [],
            socket: props.socket,
            width: window.innerWidth,
            handleBack: props.handleBack,
		};
        this.handleDropdown_small = this.handleDropdown_small.bind(this);
        this.handleDropdown = this.handleDropdown.bind(this);
        this.handleExit = this.handleExit.bind(this);
	}
    componentDidMount(){
        let self = this
        this.state.socket.on('career_read', function(data){
            let list = data;
            list = sort(list, "type");
            let header = [];
            let type = "";

            for(let i in list){
                if(type !== list[i].type){
                    type = list[i].type;
                    header.push(type);
                }                                    
            }
            if(header.length>0){
                header = ['all'].concat(header);
            }
            list = sort(list, "title");

            self.setState({ header: header });
            self.setState({ list: list });
            self.setState({ filter: list });            
        });
        this.state.socket.emit('career_send', {user_id: this.state.user_id, user: this.state.user});
    }
    handleExit(){
        this.state.handleBack('game');
    }
    handleDropdown_small(x){
        $('.career_header_title_box_container').toggleClass('open');
        if($('.career_header_title_box_container').hasClass('open')){
            $('.career_header_title i').removeClass('fa-angle-down');
            $('.career_header_title i').addClass('fa-angle-up');
        } else {
            $('.career_header_title i').addClass('fa-angle-down');
            $('.career_header_title i').removeClass('fa-angle-up');
        }
    }
    handleDropdown(x){
        $('.career_header_box').removeClass('open');
        $('#career_header_box_'+x).addClass('open');

        let list = this.state.list;
        if(x !== "all"){
            list = sort(list, "type");
            list = list.filter(function(elem){
                return elem.type === x;
            });
            this.setState({ filter: list });
        } else {
            list = sort(list, "title");
            this.setState({ filter: list });
        }
    }
	render() {
		return (
			<>
                {(() => {
                        if(this.state.filter && this.state.header){
                            if(this.state.filter.length>0 && this.state.header.length>0){
                                return(
                                    <>
                                        <div className="career_header_container">
                                            {(() => {
                                                let self = this;
                                                if (self.state.header.length>0) {
                                                    if (self.state.width < 960) {
                                                        return(
                                                            <>
                                                                <div id="career_header_title_dropdown_container">
                                                                    <div className="career_header_title_container" onClick={()=>self.handleDropdown_small()}>
                                                                        <div className="capitalize career_header_title shadow_convex">
                                                                            <span className="capitalize">all</span>
                                                                            <i className="fa fa-angle-down"></i>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="career_header_title_box_container">
                                                                    <div className="career_header_title_box">
                                                                        {
                                                                        self.state.header.map(function(item0, t){
                                                                            return(
                                                                                <div key={t} className="capitalize"  onClick={()=>self.handleDropdown(item0)}>{item0}</div>
                                                                            );
                                                                        })
                                                                    }
                                                                    </div>
                                                                </div>  
                                                            </>
                                                        );
                                                    } else {
                                                        return(
                                                            <>
                                                                {
                                                                    self.state.header.map(function(item0, t){
                                                                        if(t === 0){
                                                                            return(
                                                                                <div key={t} id={'career_header_box_'+item0} className="capitalize career_header_box open"  onClick={()=>self.handleDropdown(item0)}>{item0}</div>
                                                                            );
                                                                        } else {
                                                                            return(
                                                                                <div key={t} id={'career_header_box_'+item0} className="capitalize career_header_box"  onClick={()=>self.handleDropdown(item0)}>{item0}</div>
                                                                            );
                                                                        }
                                                                    })
                                                                }
                                                            </>
                                                        );
                                                    }                                                    
                                                }
                                            })()}   
                                        </div>
                                        <div className="career_container">
                                            <div className="career_scroll">
                                                {(() => {
                                                    let self = this;
                                                    if(self.state.filter.length>0){
                                                        return(
                                                            <>
                                                                {
                                                                    self.state.filter.map(function(item, i){
                                                                        let requirements = item.requirements;
                                                                        let responsabilities = item.responsabilities;
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
                                                                                                );
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
                                                                                                );
                                                                                            })
                                                                                        }
                                                                                    </ul>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })
                                                                }
                                                            </>
                                                        );
                                                    }
                                                })()}
                                            </div>
                                        </div>
                                    </>
                                );
                            } else {
                                if(this.state.lang === "ro"){
                                    return(
                                        <div>
                                            <p>Nu exista joburi disponibile inca.</p>
                                        </div>
                                    );
                                } else {
                                    return(
                                        <div>
                                            <p>No jobs available yet.</p>
                                        </div>
                                    );
                                }
                            }
                        } else {
                            return(
                                <div>
                                    <p>Loading...</p>
                                </div>
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

export default connect(mapStateToProps)(Career)