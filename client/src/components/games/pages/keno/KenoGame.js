import React, { useState, useEffect,useRef } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { translate } from '../../../../translations/translate'
import Counter from '../../../partials/counter'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faGear, faTrashCan, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { getWindowDimensions } from '../../../../utils/utils'
import Header from '../../../partials/header'

function KenoBoard(props){
    const {kenoSpots, settings} = props
    const {lang} = settings
    const [matrixBig, setMatrixBig] = useState([])
    const [matrixSmall, setMatrixSmall] = useState([])
    const [width, setWidth] = useState(getWindowDimensions().width)
    let keno_board = useRef(null)

    useEffect(() => {  
        scrollToTop()
    }, [])

    useEffect(() => {  
        setMatrixBig(kenoSpots)
        let newArray = kenoSpots.map(subArray => {
            const firstHalf = subArray.slice(0, 5)
            const secondHalf = subArray.slice(5, 10)
            return [firstHalf, secondHalf]
        }).flat()
        setMatrixSmall(newArray)
        scrollToTop()
    }, [kenoSpots])

    function scrollToTop(){
        if(keno_board && keno_board.current){			
            keno_board.current.scrollTo({ top: 0 })
		}
    }

    function handleClickSpot(id){
        props.handleClickSpot(id)
    }

    function handleResize() {
        setWidth(getWindowDimensions().width)
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("resize", handleResize)
            handleResize()
            return () => window.removeEventListener("resize", handleResize)
        }
    }, [])

    return <>        
        {kenoSpots && kenoSpots.length > 0 ? <div ref={keno_board} className="keno_board shadow_convex">
            {width > 600 ? <>
                {matrixBig.map((row, rowIndex) => (                
                    <div key={rowIndex} className="keno_row">
                        {row.map((spot, spotIndex) => {
                            return <div key={spotIndex} className="keno_spot">
                                <div 
                                    id={"keno_spot_box_" + spot.id}
                                    className={`keno_spot_box ${spot.selected ? 'selected' : ''} ${spot.isWinner ? 'winner' : ''} ${spot.isLoser ? 'loser' : ''}`}
                                    onClick={()=>handleClickSpot(spot.id)}
                                >{spot.id}</div>
                            </div>
                        })}
                    </div>
                ))}
            </> : <>
                {matrixSmall.map((row, rowIndex) => (                
                    <div key={rowIndex} className="keno_row">
                        {row.map((spot, spotIndex) => {
                            return <div key={spotIndex} className="keno_spot">
                                <div 
                                    id={"keno_spot_box_" + spot.id}
                                    className={`keno_spot_box ${spot.selected ? 'selected' : ''} ${spot.isWinner ? 'winner' : ''} ${spot.isLoser ? 'loser' : ''}`}
                                    onClick={()=>handleClickSpot(spot.id)}
                                >{spot.id}</div>
                            </div>
                        })}
                    </div>
                ))}
            </>}            
        </div> : <p>{translate({lang, info: "loading..."})}</p>}
    </>
}

function KenoButtons(props){
    const {kenoSpotsResult, settings} = props
    const {lang} = settings

    function gameStart(){
        props.gameStart()
    }
    function openTable(){
        props.openTable()
    }
    function resetKenoSpots(){
        props.resetKenoSpots()
    }
    function handleBack(){
        props.handleBack()
    }

    return <div className="button_action_group keno_buttons_container">
        <div className="tooltip">
            <Button 
                type="button"  
                className="mybutton round button_transparent shadow_convex"
                onClick={()=>gameStart()}
            ><FontAwesomeIcon icon={faPlay} /></Button>
            <span className="tooltiptext">{translate({lang, info: "start"})}</span>
        </div>
        {kenoSpotsResult && kenoSpotsResult.length > 0 ? null : <div className="tooltip">
            <Button 
                type="button"  
                className="mybutton round button_transparent shadow_convex"
                onClick={()=>openTable()}
            ><FontAwesomeIcon icon={faGear} /></Button>
            <span className="tooltiptext">{translate({lang, info: "settings"})}</span>
        </div>}
        {kenoSpotsResult && kenoSpotsResult.length > 0 ? null : <div className="tooltip">
            <Button 
                type="button"  
                className="mybutton round button_transparent shadow_convex"
                onClick={()=>resetKenoSpots()}
            ><FontAwesomeIcon icon={faTrashCan} /></Button>
            <span className="tooltiptext">{translate({lang, info: "reset"})}</span>
        </div>}
        <div className="tooltip">
            <Button 
                type="button"  
                className="mybutton round button_transparent shadow_convex"
                onClick={()=>{handleBack()}}
            ><FontAwesomeIcon icon={faArrowRotateLeft} /></Button>
            <span className="tooltiptext">{translate({lang, info: "back"})}</span>
        </div>
    </div>
}

function KenoQuickPick(props){
    const {settings, handleQuickPick} = props
    const {lang} = settings
    const [randomSelections, setRandomSelections] = useState(1)

    function updateQuickPickLength(e){
        setRandomSelections(e)
    }

    return <div className="keno_quickpick_container">
        <div className="keno_quickpick_counter">
            <Counter max={10} update={(e)=>updateQuickPickLength(e)} />
        </div>
        <div className="keno_quickpick_button">
            <Button 
                type="button"  
                className="mybutton button_transparent shadow_convex"
                onClick={()=>{handleQuickPick(randomSelections)}}
            ><span>{translate({lang, info: "quick_pick"})}</span></Button>
        </div>
    </div>
}

function KenoBets(props){
    const {pricePerGame, noOfGames, settings, updateKenoBets} = props
    const {lang} = settings

    return <div className="keno_bets_container">            
        <div className="keno_bets keno_bets_prive_per_game">
            <p>{translate({lang, info: "price_per_game"})}</p>
            <DropdownButton title={pricePerGame} id="keno_price_per_game" className="shadow_convex" onSelect={(e)=>updateKenoBets("price_per_game", e)}>
                <Dropdown.Item eventKey={1}>1</Dropdown.Item>
                <Dropdown.Item eventKey={2}>2</Dropdown.Item>
                <Dropdown.Item eventKey={3}>3</Dropdown.Item>
                <Dropdown.Item eventKey={5}>5</Dropdown.Item>
                <Dropdown.Item eventKey={10}>10</Dropdown.Item>
            </DropdownButton>
        </div>
        <div className="keno_bets keno_bets_no_games">
            <p>{translate({lang, info: "no_of_games"})}</p>
            <DropdownButton title={noOfGames} id="keno_no_of_games" className="shadow_convex"onSelect={(e)=>updateKenoBets("no_of_games", e)}>
                <Dropdown.Item eventKey={1}>1</Dropdown.Item>
                <Dropdown.Item eventKey={2}>2</Dropdown.Item>
                <Dropdown.Item eventKey={3}>3</Dropdown.Item>
                <Dropdown.Item eventKey={5}>5</Dropdown.Item>
                <Dropdown.Item eventKey={10}>10</Dropdown.Item>
            </DropdownButton>
        </div>
    </div>
}

function KenoSettings(props){
    const {kenoSpotsResult, settings, closeTable, resetKenoSpots} = props
    const {lang} = settings
    let open = props.open ? "open" : ""

    return <div id="keno_game_bets" className={"game_bets_container " + open}>
        <div className="game_bets shadow_concav">
            <div className="close" onClick={()=>closeTable()}>x</div>
            <div className="game_bets_box">
                <p>{translate({lang, info: "keno_instructions"})}</p>					
                <KenoQuickPick {...props} />
                <KenoBets {...props} /> 
                <div className="button_action_group">
                    {kenoSpotsResult && kenoSpotsResult.length > 0 ? null : <Button 
                        type="button"  
                        className="mybutton round button_transparent shadow_convex"
                        onClick={()=>{resetKenoSpots()}}
                    ><FontAwesomeIcon icon={faTrashCan} /></Button>}
                </div>   
            </div>
        </div>
    </div>
}

function KenoGame(props){
    const {page, settings, handleShowPrizes} = props
    const {lang, theme} = settings
    const [open, setOpen] = useState(false)

    function openTable(){setOpen(true)}
    function closeTable(){setOpen(false)}

    return <>
        <Header template={"game"} details={page} lang={lang} theme={theme}/>
        <Row className="keno_game">
            <Col sm={12}>
                <KenoBoard {...props} />
            </Col>
            <Col sm={12}>
                <Row>
                    <Col lg={2} />
                    <Col lg={8}>
                        <Row>
                            <Col sm={6}>
                                <KenoButtons {...props} openTable={()=>openTable()}/>
                            </Col>
                            <Col sm={6}>
                                <div className="keno_prize_container button_action_group">
                                    <Button 
                                        type="button"
                                        className="mybutton button_transparent shadow_convex"
                                        onClick={()=>handleShowPrizes()}                   
                                    >{translate({lang, info: "keno_prizes"})}</Button>	
                                </div>
                            </Col>
                        </Row>  
                    </Col>
                    <Col lg={2} />
                </Row>
            </Col>
            <KenoSettings {...props} open={open} closeTable={()=>closeTable()} />
        </Row>
    </>
}

export default KenoGame