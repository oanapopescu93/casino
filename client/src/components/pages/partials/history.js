import React from 'react';
import $ from 'jquery';
import Table from 'react-bootstrap/Table'

function HistoryTable(props){    
    let template = props.template;
    let history = props.history;
    let lang = props.lang;
    let rowspan = 0;
    var title = template.charAt(0).toUpperCase() + template.slice(1);
    console.log('HistoryShort ', title, template, history)

    switch(template){
        case "roulette":
            rowspan = history.length.toString();
            return(
                <>
                    <h3>{title}</h3>
                    <Table className="history_container 111">
                        <thead>
                            <tr>
                                <th>{lang === "ro" ? <span>Nr. norocos</span> : <span>Lucky no.</span>}</th>
                                <th>{lang === "ro" ? <span>Nr. tau</span> : <span>Your no.</span>}</th>
                                <th>{lang === "ro" ? <span>Status</span> : <span>Status</span>}</th>
                                <th>{lang === "ro" ? <span>Morcovi</span> : <span>Carrots</span>}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {																					
                                history.map(function(item, i){
                                    var history_elem = item	
                                    if(i === 0){
                                        if(history_elem.win){
                                            return(
                                                <tr key={i} className="history_box">
                                                    <td rowSpan={rowspan}>{history_elem.lucky_nr}</td>
                                                    <td>{history_elem.text}</td>	
                                                    <td>{lang === "ro" ? <span>Ai castigat </span> : <span>You won </span>}{history_elem.bet_value}</td>
                                                    <td>{history_elem.money_history}</td>																				
                                                </tr>
                                            )
                                        } else {
                                            return(
                                                <tr key={i} className="history_box">
                                                    <td rowSpan={rowspan}>{history_elem.lucky_nr}</td>
                                                    <td>{history_elem.text}</td>
                                                    <td>{lang === "ro" ? <span>Ai pierdut </span> : <span>You lost </span>}{history_elem.bet_value}</td>
                                                    <td>{history_elem.money_history}</td>																						
                                                </tr>
                                            )
                                        }													
                                    } else {
                                        if(history_elem.win){
                                            return(
                                                <tr key={i} className="history_box">
                                                    <td>{history_elem.text}</td>	
                                                    <td>{lang === "ro" ? <span>Ai castigat </span> : <span>Won </span>}{history_elem.bet_value} carrot</td>
                                                    <td>{history_elem.money_history}</td>																				
                                                </tr>
                                            )
                                        } else {
                                            return(
                                                <tr key={i} className="history_box">
                                                    <td>{history_elem.text}</td>
                                                    <td>{lang === "ro" ? <span>Ai pierdut </span> : <span>Lost </span>}{history_elem.bet_value} carrot</td>
                                                    <td>{history_elem.money_history}</td>																					
                                                </tr>
                                            )
                                        }	
                                    }																																		
                                })
                            }
                        </tbody>
                    </Table>
                </>
            );
        case "blackjack":  
            return(
                <>
                    <h3>{title}</h3>
                    <Table className="history_container 222">
                        <thead>
                            <tr>
                                <th>{lang === "ro" ? <span>Tu</span> : <span>You</span>}</th>
                                <th>{lang === "ro" ? <span>Dealer</span> : <span>Dealer</span>}</th>
                                <th>{lang === "ro" ? <span>Status</span> : <span>Status</span>}</th>
                                <th>{lang === "ro" ? <span>Morcovi</span> : <span>Carrots</span>}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {(() => {
                                    if(history[0].win){
                                        return(                                        
                                            <>
                                                <td>{history[0].blackjack_hand.player.points}</td>
                                                <td>{history[0].blackjack_hand.dealer.points}</td>
                                                <td>{lang === "ro" ? <span>Ai castigat </span> : <span>You won </span>}{history[0].bet_value}</td>
                                                <td>{history[0].money_history}</td>
                                            </>
                                        )
                                    } else {
                                        return(                                        
                                            <>
                                                <td>{history[0].blackjack_hand.player.points}</td>
                                                <td>{history[0].blackjack_hand.dealer.points}</td>
                                                <td>{lang === "ro" ? <span>Ai pierdut </span> : <span>You lost </span>}{history[0].bet_value}</td>
                                                <td>{history[0].money_history}</td>
                                            </>
                                        )
                                    }
                                })()}
                            </tr>
                        </tbody>
                    </Table>
                </>
            );
        case "slots":            
            return(
                <>
                    <h3>{title}</h3>
                    <Table className="history_container 333">
                        <thead>
                            <tr>                                
                                <th>{lang === "ro" ? <span>Status</span> : <span>Status</span>}</th>
                                <th>{lang === "ro" ? <span>Morcovi</span> : <span>Carrots</span>}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {(() => {
                                    if(history[0].win){
                                        return(                                        
                                            <>                                                
                                                <td>{lang === "ro" ? <span>Ai castigat </span> : <span>You won </span>}{history[0].bet_value}</td>
                                                <td>{history[0].money_history}</td>
                                            </>
                                        )
                                    } else {
                                        return(                                        
                                            <>                                                
                                                <td>{lang === "ro" ? <span>Ai pierdut </span> : <span>You lost </span>}{history[0].bet_value}</td>
                                                <td>{history[0].money_history}</td>
                                            </>
                                        )
                                    }
                                })()}
                            </tr>
                        </tbody>
                    </Table>
                </>
            );
        case "craps":
            return(
                <>
                    <h3>{title}</h3>
                    <Table className="history_container 444">
                        <thead>
                            <tr>                                
                                <th>{lang === "ro" ? <span>Status</span> : <span>Status</span>}</th>
                                <th>{lang === "ro" ? <span>Morcovi</span> : <span>Carrots</span>}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {(() => {
                                    if(history[0].win){
                                        return(                                        
                                            <>                                                
                                                <td>{lang === "ro" ? <span>Ai castigat </span> : <span>You won </span>}{history[0].bet_value}</td>
                                                <td>{history[0].money_history}</td>
                                            </>
                                        )
                                    } else {
                                        return(                                        
                                            <>                                                
                                                <td>{lang === "ro" ? <span>Ai pierdut </span> : <span>You lost </span>}{history[0].bet_value}</td>
                                                <td>{history[0].money_history}</td>
                                            </>
                                        )
                                    }
                                })()}
                            </tr>
                        </tbody>
                    </Table>
                </>
            );
        case "race":
            return(
                <>
                    <h3>{title}</h3>
                    <Table className="history_container 555">
                        <thead>
                            <tr>
                                <th>{lang === "ro" ? <span>Ordine iepuri</span> : <span>Bunny order</span>}</th>
                                <th>{lang === "ro" ? <span>Iepurele tau</span> : <span>Your bunny</span>}</th>
                                <th>{lang === "ro" ? <span>Status</span> : <span>Status</span>}</th>
                                <th>{lang === "ro" ? <span>Morcovi</span> : <span>Carrots</span>}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {(() => {
                                    if(history[0].win){
                                        return(                                        
                                            <>
                                                <td>
                                                    {																					
                                                        history[0].rabbit_list.map(function(item, i){
                                                            return(
                                                                <div key={i}><span>{i+1}</span> - <span>{item.name}</span></div>
                                                            );                                                                                                                                    
                                                        })
                                                    }
                                                </td>
                                                <td><span>{history[0].history.name}</span><span>{history[0].history.place}</span></td>
                                                <td>{lang === "ro" ? <span>Ai castigat </span> : <span>You won </span>}{history[0].history.bet}</td>
                                                <td>{history[0].money_history}</td>
                                            </>
                                        )
                                    } else {
                                        return(                                        
                                            <>
                                                <td>
                                                    {																					
                                                        history[0].rabbit_list.map(function(item, i){
                                                            return(
                                                                <div key={i}><span>{i+1}</span> - <span>{item.name}</span></div>
                                                            );                                                                                                                                    
                                                        })
                                                    }
                                                </td>
                                                <td><span>{history[0].history.name}</span><span>{history[0].history.place}</span></td>
                                                <td>{lang === "ro" ? <span>Ai pierdut </span> : <span>You lost </span>}{history[0].history.bet}</td>
                                                <td>{history[0].money_history}</td>
                                            </>
                                        )
                                    }
                                })()}
                            </tr>
                        </tbody>
                    </Table>
                </>
            );
        default:
            return(
                <p>{lang === "ro" ? <span>Eroare.</span> : <span>Ups, something went wrong.</span>}</p>
            );
    }
}

class HistoryShort extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            history: this.props.history,
            lang: this.props.lang,
		};
	}    
	
	render(){
        let lang = this.props.lang;
		return (            
            <>
                <div className="history_box">
                    {(() => {
                        if (this.state.history.roulette === null && this.state.history.blackjack === null && this.state.history.slots === null && this.state.history.craps === null && this.state.history.race === null) {
                            return (
                                <p>{lang === "ro" ? <span>Nu ai niciun pariu recent</span> : <span>You don't have e recent bet</span>}</p>
                            )
                        } else {
                            return (
                                <>
                                    { this.state.history.roulette && this.state.history.roulette.length>0 ? <HistoryTable template="roulette" lang={lang} history={this.state.history.roulette}></HistoryTable> : null}                                    
                                    { this.state.history.blackjack && this.state.history.blackjack.length>0 ? <HistoryTable template="blackjack" lang={lang} history={this.state.history.blackjack}></HistoryTable> : null}
                                    { this.state.history.slots && this.state.history.slots.length>0 ? <HistoryTable template="slots" lang={lang} history={this.state.history.slots}></HistoryTable> : null}
                                    { this.state.history.craps && this.state.history.craps.length>0 ? <HistoryTable template="craps" lang={lang} history={this.state.history.craps}></HistoryTable> : null}
                                    { this.state.history.race && this.state.history.race.length>0 ? <HistoryTable template="race" lang={lang} history={this.state.history.race}></HistoryTable> : null}
                                </>
                            );
                        }
                    })()}
                </div>
            </>
		);
	};
}

class Transactions extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            data: this.props.data,
            lang: this.props.lang,
		};
	}    
	
	render(){
        let lang = this.props.lang;
		return ( 
            <p>{lang === "ro" ? <span>Nu exista tranzactii</span> : <span>There are no transactions</span>}</p>
		);
	};
}

class History extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            history: this.props.history,
            transactions: this.props.transactions,
            visible: true,
            lang: this.props.lang,
		};
        this.history_choose_tab = this.history_choose_tab.bind(this);
	}

    history_choose_tab = function(link){	
		if(link === "history"){			
			this.setState({ visible: true })
			$('#history').addClass('active');
			$('#transactions').removeClass('active');
		} else if(link === "transactions"){
			this.setState({ visible: false })
			$('#history').removeClass('active');
			$('#transactions').addClass('active');
		}
	}	
	
	render(){
        let lang = this.props.lang;
		return (
            <>                
                <div className="history_tabs_container">
					<div id="history" className="history_tabs shadow_convex active" onClick={()=>this.history_choose_tab("history")}>
						{lang === "ro" ? <span>Ultimul pariu</span> : <span>Last bet</span>}
					</div>
					<div id="transaction" className="history_tabs shadow_convex" onClick={()=>this.history_choose_tab("transaction")}>
                        {lang === "ro" ? <span>Tranzactii</span> : <span>Transactions</span>}
                    </div>
				</div>
                { this.state.visible ? <HistoryShort lang={lang} history={this.state.history}></HistoryShort> : 
					<Transactions lang={lang} data={this.state.transactions}></Transactions>
				}
            </>
		);
	};
}

export default History;