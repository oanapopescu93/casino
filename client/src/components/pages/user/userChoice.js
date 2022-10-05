import React, {useState } from 'react'
import { useSelector, useDispatch} from 'react-redux'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Game from '../games/game'
import Sapou from '../partials/sapou'
import About from '../other_pages/about'
import Support from '../other_pages/support'
import Terms from '../other_pages/terms'
import Privacy from '../other_pages/privacy'
import Questions from '../other_pages/questions'
import Career from '../other_pages/career'
import SalonGames from '../salon/salon_games'
import Page from '../money/page'
import { game_page, game_visible } from '../../actions/actions'
import UserAccount from '../account/userAccount'
import Panel from '../panel/panel_control'

function UserChoice(props) {
    let dispatch = useDispatch()
	let visible = useSelector(state => state.visibility)
    let page = useSelector(state => state.page)
    const [game, setGame] = useState(null)
	let data = props.data
    let choice = props.choice

    function gameChoice(x){
        dispatch(game_visible('game'))
        setGame(x)
    }

    function back(){
        dispatch(game_page("salon"))
    }

	return (
		<div className="userPage"> 
			<Row>
				<Col sm={12}>	
                    {(() => {
                        //console.log('userPage--> ', visible, choice, page)
                        switch (visible) {
                            case "game":
                                return (
                                    <>
                                        {(() => {
                                            switch (choice) {
                                                case "games":
                                                    switch (page) {
                                                        case "current_game":
                                                        case "roulette":                                                            
                                                        case "blackjack":
                                                        case "slots":
                                                        case "craps":
                                                            return <Game lang={props.lang} socket={props.socket} data={data} game_choice={game}></Game>
                                                        case "donation":
                                                            return <Page lang={props.lang} socket={props.socket} back={back}></Page>
                                                        default:
                                                            return (
                                                                <>
                                                                    <Sapou lang={props.lang} page="salon"></Sapou>
                                                                    <SalonGames gameChoice={gameChoice} lang={props.lang} socket={props.socket} data={data}></SalonGames>
                                                                </>
                                                            )
                                                    }
                                                case "race":
                                                case "keno":
                                                    if(page === "donation"){
                                                        return <Page lang={props.lang} socket={props.socket} back={back}></Page>
                                                    } else {
                                                        return <Game lang={props.lang} socket={props.socket} data={data} game_choice={choice}></Game>
                                                    }
                                                    
                                                default:
                                                    return(
                                                        <>
                                                            <Sapou lang={props.lang} page="salon"></Sapou>
                                                            <SalonGames gameChoice={gameChoice} lang={props.lang} socket={props.socket} data={data}></SalonGames>
                                                        </>
                                                    )						
                                            }
                                        })()}
                                    </>
                                )
                            case "account":
                                return (
                                    <>
                                        <UserAccount lang={props.lang} socket={props.socket} info={data}></UserAccount>
                                        <Panel lang={props.lang} socket={props.socket} data={props.data} game_choice={'account'}></Panel>
                                    </>												
                                )
                            case "about":
                                return (
                                    <>
                                        <Sapou lang={props.lang} page={visible}></Sapou>
                                        <About info={data}></About>
                                    </>
                                )	
                            case "support":
                                return (
                                    <>
                                        <Sapou lang={props.lang} page={visible}></Sapou>
                                        <Support info={data}></Support>
                                    </>
                                )
                            case "terms":
                                return (
                                    <>
                                        <Sapou lang={props.lang} page={visible}></Sapou>
                                        <Terms info={data}></Terms>
                                    </>
                                )
                            case "privacy":
                                return (
                                    <>
                                        <Sapou lang={props.lang} page={visible}></Sapou>
                                        <Privacy info={data}></Privacy>
                                    </>
                                )
                            case "questions":
                                return (
                                    <>
                                        <Sapou lang={props.lang} page={visible}></Sapou>
                                        <Questions info={data}></Questions>
                                    </>
                                )
                            case "career":
                                return (
                                    <>
                                        <Sapou lang={props.lang} page={visible}></Sapou>
										<Career info={data}></Career>
                                    </>
                                )
                            default:
                                return(
                                    <>
                                        <Sapou lang={props.lang} page="salon"></Sapou>
                                        <SalonGames gameChoice={gameChoice} lang={props.lang} socket={props.socket} data={data}></SalonGames>
                                    </>
                                )						
                        }
					})()}		
				</Col>
			</Row>
		</div>
	)
}

export default UserChoice