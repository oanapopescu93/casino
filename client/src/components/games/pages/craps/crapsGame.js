/* eslint-disable react/display-name */

import React, { useRef, forwardRef, useImperativeHandle } from 'react'
import Header from '../../../partials/header'
import { translate } from '../../../../translations/translate'
import { Button, Row, Col } from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPlay, faCarrot, faArrowRotateLeft} from '@fortawesome/free-solid-svg-icons'
import Dice from './components/dice'
import Counter from '../../../partials/counter'
import Board from './components/board'
import $ from "jquery"

const CrapsGame = forwardRef((props, ref) => {
	const {
        page, settings, betInfo, startGame, showNumbers, crapsBoardList,
        updateBets, gameStart, openTable, handleHandleExit
    } = props
    const { lang, theme } = settings
    const { gameType, bet } = betInfo

    let crapsBoard = useRef(null)

	useImperativeHandle(ref, () => ({
		scrollToBottom() {
			if(crapsBoard && crapsBoard.current){
				let board = crapsBoard.current
				let height = $(board)[0].scrollHeight
				$(board).animate({scrollTop: height}, "fast")
			}
		},
	}), [crapsBoard])

    return <div id="craps_game" className="game_box">
		<Header template={"game"} details={page} lang={lang} theme={theme}/>
		<Row>
			<Col sm={12}>
				<h3 className="craps_subtitle"><span>{translate({lang, info: "bet_type"})}: </span>{gameType}</h3>
			</Col>
		</Row>
        <Row>
            <Col sm={2} />
            <Col sm={8}>
				<Row>
					<Col lg={6}>
                        <Row>
                            <Col sm={startGame ? 6 : 12} md={12}>
                                <div className="dice_container">
                                    <Dice number={0} showNumbers={showNumbers} />
                                    <Dice number={1} showNumbers={showNumbers} />
                                </div>
                            </Col>
                            {!startGame ? <Col sm={6} md={12}>
                                <div className="bets_container">
                                    <Counter min={0} num={bet} max={100} update={(e)=>updateBets(e)} />
                                </div>
                            </Col> : null}
                        </Row>

						{!startGame ? <div className="button_action_group">
							<div className="tooltip">
								<Button 
									type="button"
									className="mybutton round button_transparent shadow_convex"
									onClick={()=>gameStart()}
								><FontAwesomeIcon icon={faPlay} /></Button>
								<span className="tooltiptext">{translate({lang, info: "start"})}</span>
							</div>
                            <div className="tooltip">
								<Button 
									type="button"
									className="mybutton round button_transparent shadow_convex"
									onClick={()=>openTable()}
								><FontAwesomeIcon icon={faCarrot} /></Button>
								<span className="tooltiptext">{translate({lang, info: "settings"})}</span>
							</div>
							<div className="tooltip">
								<Button 
									type="button"
									className="mybutton round button_transparent shadow_convex"
									onClick={()=>handleHandleExit()}
								><FontAwesomeIcon icon={faArrowRotateLeft} /></Button>
								<span className="tooltiptext">{translate({lang, info: "back"})}</span>
							</div>
						</div> : null}						
					</Col>
					<Col lg={6} className="craps_board_container">
						<div className="craps_board_box">
							<div className="deco">
								<div readOnly id="craps_board" className="craps_board" ref={crapsBoard}>
									<Board {...props} list={crapsBoardList} />
								</div>
							</div>
						</div>
					</Col>
				</Row>
            </Col>
            <Col sm={2} />
        </Row>
    </div>
})

export default CrapsGame