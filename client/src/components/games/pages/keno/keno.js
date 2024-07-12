import React, {useState, useEffect} from 'react'
import KenoAnimation from './kenoAnimation'
import KenoGame from './KenoGame'
import { useDispatch } from 'react-redux'
import { changePopup } from '../../../../reducers/popup'
import { translate } from '../../../../translations/translate'
import { decryptData } from '../../../../utils/crypto'

function Keno(props){
    const {page, home, user, settings, socket} = props
    const {lang} = settings

    let game = page.game
    let money = user.money ? decryptData(user.money) : 0
    let dispatch = useDispatch()

    const [kenoSpots, setKenoSpots] = useState([])
    const [kenoSpotsSelectedArray, setKenoSpotsSelectedArray] = useState([])
    const [kenoSpotsResult, setKenoSpotsResult] = useState([])
    const [start, setStart] = useState(false)
    const [maxSelected, setMaxSelected] = useState(10)
    const [pricePerGame, setPricePerGame] = useState(1)
    const [noOfGames, setNoOfGames] = useState(1)

    let flaskAnimationFinished = false
    let ballsAnimationFinished = false

    useEffect(() => {
        createKenoMatrix(80)
        return () => {            
			setKenoSpots([])
            setKenoSpotsSelectedArray([])
            setKenoSpotsResult([])
            setStart(false)
            setMaxSelected(10)
            setPricePerGame(1)
            setNoOfGames(1)
		}
    }, [])

    function createKenoMatrix(){
        const matrix = []
        let index = 1
        for (let i = 0; i < 8; i++) {
            const row = []
            for (let j = 0; j < 10; j++) {
                row.push({ id: index, selected: false })
                index++
            }
            matrix.push(row)
        }
        setKenoSpots(matrix)
    }

    function handleClickSpot(row, id){
        let selectedCount = 0

        const updatedSpots = kenoSpots.map((r, rowIndex) => 
            rowIndex === row ? 
                r.map(spot => {
                    if (spot.id === id) {
                        selectedCount += !spot.selected ? 1 : -1;
                        return { ...spot, selected: !spot.selected }
                    }
                    if (spot.selected) selectedCount++;
                    return spot;
                }) : 
                r.map(spot => {
                    if (spot.selected) selectedCount++;
                    return spot;
                })
        )

        if (selectedCount > maxSelected) {
            showError("keno_too_many_selected")
        } else {
            setKenoSpots(updatedSpots)
        }
    }

    function showError(text){
        let payload = {
            open: true,
            template: "error",
            title: "error",
            data: translate({lang: lang, info: text}),
            size: 'sm',
        }
        dispatch(changePopup(payload))
    }

    function handleQuickPick(e){
        randomSelectSpots(e)
    }

    function randomSelectSpots(how_many){
        setMaxSelected(how_many)
        let flatSpots = kenoSpots.flat()
        flatSpots = flatSpots.sort(() => 0.5 - Math.random()) // Shuffle the spots
        const selectedSpots = flatSpots.slice(0, how_many) // Select the first how_many spots

        const updatedSpots = kenoSpots.map(row =>
            row.map(spot =>
                selectedSpots.find(selected => selected.id === spot.id)
                    ? { ...spot, selected: true }
                    : { ...spot, selected: false }
            )
        )
        
        setKenoSpots(updatedSpots)
    }

    function resetKenoSpots() {
        setKenoSpots(prevSpots =>
            prevSpots.map(row =>
                row.map(spot => {
                    const { isWinner, isLoser, ...rest } = spot
                    return { ...rest, selected: false }
                })
            )
        )
        setMaxSelected(10)
        setPricePerGame(1)
        setNoOfGames(1)
    }    

    function getSelectedKenoIds() {
        return kenoSpots.flat().filter(spot => spot.selected).map(spot => spot.id)
    }

    function updateKenoBets(type, e){
        let newValue = parseInt(e)
        switch(type){
            case "price_per_game":
                if (calculateTotalCost(newValue, noOfGames) <= money) {
                    setPricePerGame(newValue)
                } else {
                    showError("not_enough_money")
                }
                break
            case "no_of_games":
                if (calculateTotalCost(pricePerGame, newValue) <= money) {
                    setNoOfGames(newValue)
                } else {
                    showError("not_enough_money")
                }
                break
            default:
        }
    }

    function calculateTotalCost(price, qty){
        return price * qty
    }

    function gameStart(){
        if(kenoSpotsResult && kenoSpotsResult.length > 0){
            setKenoSpotsResult([])
            resetKenoSpots()
        } else {
            let selectedArray = getSelectedKenoIds()
            setKenoSpotsSelectedArray(selectedArray)
            if(selectedArray.length > 0){            
                handleStartGame()
            } else {
                showError("no_bets")
            }
        }
    }

    function handleBack(){
        props.handleHandleExit()
    }

    function handleShowPrizes(){
        let payload = {
            open: true,
            template: "keno_prizes",
            title: "keno_prizes",
            data: home.keno_prizes,
            size: 'lg',
        }
        dispatch(changePopup(payload))
    }

    function handleStartGame(){
        setStart(true)
        sendKenoData()
    }

    function sendKenoData(){
        let selectedArray = getSelectedKenoIds()
        setKenoSpotsSelectedArray(selectedArray)
        let keno_payload_server = {
            uuid: user.uuid,
            length: selectedArray.length, 
            max: calculateTotalSpots(kenoSpots),
            no_of_games: noOfGames
        }        
        socket.emit('keno_send', keno_payload_server)
    }

    function calculateTotalSpots(array) {
        let totalSpots = 0
        array.forEach(row => {
            totalSpots += row.length
        })        
        return totalSpots
    }

    useEffect(() => {
        const handleKenoRead = (data)=>{
            if(data && data[0] && data[0].length > 0){
                setKenoSpotsResult(data[0])
            }
        }
		socket.on('keno_read', handleKenoRead)
		return () => {
            socket.off('keno_read', handleKenoRead)
        }
    }, [socket])

    function animationFinished(e){
        switch(e){
            case "flask":
                flaskAnimationFinished = true
                break
            case "balls":
                ballsAnimationFinished = true
                break
            default:
                flaskAnimationFinished = true
                ballsAnimationFinished = true
        }        
        if(flaskAnimationFinished && ballsAnimationFinished){
            setStart(false)
            winLose()
        }  
    }

    function winLose(){
        let keno_prizes = home.keno_prizes
        let totalWinnings = 0
        let selectedSpotsCount = 0
        let matchedNumbers = 0

        // Count selected spots and matched numbers
        kenoSpots.forEach((spotSet) => {
            spotSet.forEach((spot) => {
                if (spot.selected) {
                    selectedSpotsCount++
                    if (spot.isWinner) {
                        matchedNumbers++
                    }
                }
            })
        })

        // Determine the prize based on selectedSpotsCount and matchedNumbers
        if (selectedSpotsCount > 0 && selectedSpotsCount <= keno_prizes.length) {
            let prizeList = keno_prizes[selectedSpotsCount - 1]
            prizeList.forEach((prize) => {
                if (prize.numbers_matched === matchedNumbers) {
                    totalWinnings = prize.win
                }
            })
        }
        
        let bet = pricePerGame * noOfGames
        let status = totalWinnings > 0 ? "win" : "lose"        
        let keno_payload = {
            uuid: user.uuid,
            game,
            status,
            bet,
            money: (money - bet) + (totalWinnings * noOfGames)
        }
        props.results(keno_payload)
    }

    useEffect(() => {
        if(kenoSpotsResult && kenoSpotsResult.length > 0){
            updateKenoSpots()
        }        
    }, [kenoSpotsResult])

    function updateKenoSpots() {
        const updatedMatrix = kenoSpots.map(row =>
            row.map(spot => ({
                ...spot,
                isWinner: kenoSpotsResult.includes(spot.id) && spot.selected,
                isLoser: kenoSpotsResult.includes(spot.id) && !spot.selected,
            }))
        );
        setKenoSpots(updatedMatrix)
    }

    return <>
        {start ? <KenoAnimation 
            {...props} 
            kenoSpots={kenoSpots}
            kenoSpotsSelectedArray={kenoSpotsSelectedArray}
            kenoSpotsResult={kenoSpotsResult}
            pricePerGame={pricePerGame}
            noOfGames={noOfGames}
            animationFinished={(e)=>animationFinished(e)}
        /> : <KenoGame 
            {...props} 
            start={start}
            kenoSpots={kenoSpots}
            kenoSpotsSelectedArray={kenoSpotsSelectedArray}
            pricePerGame={pricePerGame}
            noOfGames={noOfGames}
            kenoSpotsResult={kenoSpotsResult}
            handleClickSpot={(row, id)=>handleClickSpot(row, id)}
            handleQuickPick={(e)=>handleQuickPick(e)}
            updateKenoBets={(type, e)=>updateKenoBets(type, e)}
            handleShowPrizes={()=>handleShowPrizes()}
            resetKenoSpots={()=>resetKenoSpots()}
            gameStart={()=>gameStart()}
            handleBack={()=>handleBack()}
        />}
    </>
}

export default Keno