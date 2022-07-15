import React, {useState} from 'react';
import Table from 'react-bootstrap/Table'

function HistoryTable(props){    
    let template = props.template;
    let history = props.history;
    let lang = props.lang;
    let rowspan = 0;
    var title = template.charAt(0).toUpperCase() + template.slice(1);
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

function HistoryShort(props){
	let history = props.history;
    let lang = props.lang;	
    return (
        <div className="history_box">
            {(() => {
                if (history.roulette === null && history.blackjack === null && history.slots === null && history.craps === null && history.race === null) {
                    return (
                        <p>{lang === "ro" ? <span>Nu ai niciun pariu recent</span> : <span>You don't have recent bet</span>}</p>
                    )
                } else {
                    return (
                        <>
                            { history.roulette && history.roulette.length>0 ? <HistoryTable template="roulette" lang={lang} history={history.roulette}></HistoryTable> : null}                                    
                            { history.blackjack && history.blackjack.length>0 ? <HistoryTable template="blackjack" lang={lang} history={history.blackjack}></HistoryTable> : null}
                            { history.slots && history.slots.length>0 ? <HistoryTable template="slots" lang={lang} history={history.slots}></HistoryTable> : null}
                            { history.craps && history.craps.length>0 ? <HistoryTable template="craps" lang={lang} history={history.craps}></HistoryTable> : null}
                            { history.race && history.race.length>0 ? <HistoryTable template="race" lang={lang} history={history.race}></HistoryTable> : null}
                        </>
                    );
                }
            })()}
        </div>
    );
}

function Transactions(props){
    let data = props.data;
    let lang = props.lang;
    return ( 
        <div className="transactions_box">
            {(() => {
                if (data && data.length>0) {
                    return (
                        <p>{lang === "ro" ? <span>Nu exista metoda de plata inca.</span> : <span>No payment methods yet.</span>}</p>
                    )
                } else {
                    return (
                        <p>{lang === "ro" ? <span>Nu exista tranzactii</span> : <span>There are no transactions</span>}</p>
                    );
                }
            })()}
        </div>
    );
}

function History(props){
	let history = props.history;
    let transactions = props.transactions;    
    let lang = props.lang;
    const [visible, setVisible] = useState("history");
    const [tab1, setTab1] = useState("active");
    const [tab2, setTab2] = useState("");

    function history_choose_tab(link){
		setVisible(link);
        if(link === "history"){
            setTab1("active");
            setTab2("");
		} else if(link === "transactions"){
            setTab1("");
            setTab2("active");
		}
	}
	
    return (
        <>                
            <div className="history_tabs_container">
                <div id="history" className={"history_tabs shadow_convex "+tab1} onClick={()=>history_choose_tab("history")}>
                    {lang === "ro" ? <span>Ultimul pariu</span> : <span>Last bet</span>}
                </div>
                <div id="transaction" className={"history_tabs shadow_convex "+tab2} onClick={()=>history_choose_tab("transaction")}>
                    {lang === "ro" ? <span>Tranzactii</span> : <span>Transactions</span>}
                </div>
            </div>
            { visible == "history" ? <HistoryShort lang={lang} history={history}></HistoryShort> : 
                <Transactions lang={lang} data={transactions}></Transactions>
            }
        </>
    );
}

export default History;