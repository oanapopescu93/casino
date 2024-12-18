import React, { useEffect, useState } from 'react'
import { decryptData } from '../../../../utils/crypto'
import { getWindowDimensions, useHandleErrors } from '../../../../utils/utils'
import RaceGame from './raceGame'
import RaceTables from './raceTables'
import { checkBets } from '../../../../utils/checkBets'

import rabbit_sit_yellow from '../../../../img/rabbit_move/yellow/rabbit000.png'
import rabbit_move_yellow from '../../../../img/rabbit_move/yellow/rabbit_move.png'
import rabbit_sit_pink from '../../../../img/rabbit_move/pink/rabbit000.png'
import rabbit_move_pink from '../../../../img/rabbit_move/pink/rabbit_move.png'
import rabbit_sit_green from '../../../../img/rabbit_move/green/rabbit000.png'
import rabbit_move_green from '../../../../img/rabbit_move/green/rabbit_move.png'
import rabbit_sit_orange from '../../../../img/rabbit_move/orange/rabbit000.png'
import rabbit_move_orange from '../../../../img/rabbit_move/orange/rabbit_move.png'

import obstacle_yellow from '../../../../img/icons/obstacle_yellow.png'
import obstacle_pink from '../../../../img/icons/obstacle_pink.png'
import obstacle_green from '../../../../img/icons/obstacle_green.png'
import obstacle_orange from '../../../../img/icons/obstacle_orange.png'
import { useSelector } from 'react-redux'

function Race(props){
    const {settings, user, home} = props
    const {lang, theme} = settings
    const {race_rabbits} = home    

    const [startRace, setStartRace] = useState(false)    
    const [rabbitArray, setRabbitArray] = useState([])
    const [bets, setBets] = useState(0)
    const [width, setWidth] = useState(getWindowDimensions().width)
    const [images, setImages] = useState(null)
    const [raceInfo, setRaceInfo] = useState([])

    let moneyEncrypted = useSelector(state => state.auth.money)
    let money = moneyEncrypted ? decryptData(moneyEncrypted) : 0
    let moneyPerWin = 10

    const handleErrors = useHandleErrors()

    useEffect(() => {
        setRabbitArray(getRabbitArray())
        return () => {
            setRabbitArray([])
        }
    }, [race_rabbits])

    function getRabbitArray(){
        let array = []    
        if(race_rabbits && race_rabbits.length > 0){
            array = race_rabbits.filter((x)=>{
                return x.participating
            })
        }
        return array
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

    function getData(x){
        setRaceInfo(x)
        let totalBets = calculateTotalBets(x)
        if(checkBets({bets: totalBets, money, lang}, handleErrors)){
            setBets(totalBets)
		    setStartRace(true)
        }
    }

    function calculateTotalBets(array){
        let total = 0
        if(array && array.length>0){
            for(let i in array){
                if(array[i].bet){
                    total = total + array[i].bet
                }
            }
        }
        return total
    }

    useEffect(() => {
        let rabbitImgSit = {src: rabbit_sit_yellow}
        let rabbitImgMove = {src: rabbit_move_yellow}
        let rabbitImgStop = {src: rabbit_sit_yellow}
        let obstacleImg = {src: obstacle_yellow}

        switch(theme){
            case "purple":
                rabbitImgSit = {src: rabbit_sit_pink}
                rabbitImgMove = {src: rabbit_move_pink}
                rabbitImgStop = {src: rabbit_sit_pink}
                obstacleImg = {src: obstacle_pink}
                break
            case "black":
                rabbitImgSit = {src: rabbit_sit_green}
                rabbitImgMove = {src: rabbit_move_green}
                rabbitImgStop = {src: rabbit_sit_green}
                obstacleImg = {src: obstacle_green}
                break
            case "blue":
                rabbitImgSit = {src: rabbit_sit_orange}
                rabbitImgMove = {src: rabbit_move_orange}
                rabbitImgStop = {src: rabbit_sit_orange}
                obstacleImg = {src: obstacle_orange}
                break
            case "green":
            default:
                rabbitImgSit = {src: rabbit_sit_yellow}
                rabbitImgMove = {src: rabbit_move_yellow}
                rabbitImgStop = {src: rabbit_sit_yellow}
                obstacleImg = {src: obstacle_yellow}
                break
        }

        let promises = []
        promises.push(preaload_images(rabbitImgSit))
        promises.push(preaload_images(rabbitImgMove))
        promises.push(preaload_images(rabbitImgStop))
        promises.push(preaload_images(obstacleImg))
        Promise.all(promises).then((result)=>{
            setImages(result)
        })
    }, [])

    function preaload_images(img){
		return new Promise((resolve)=>{
			let image = new Image()
			image.src = img.src
			image.addEventListener("load", ()=>{
				resolve(image)
			}, false)
		})
	}

    function handleExit(){
        let totalBets = calculateTotalBets(raceInfo)
        setStartRace(false)
        setBets(0)
        setRaceInfo([])

        if(totalBets > 0){
            let race_payload = {
                uuid: user.uuid,
                game: "race",
                money: money - totalBets,
                status: "lose",
                bet: totalBets
            }    
            props.results(race_payload)
        }
    }

    function handleRaceResults(rabbitList){
        setStartRace(false)
        setBets(0)
        setRaceInfo([])
		pay(rabbitList)
    }

    function pay(rabbitList){
        let sum = money
		
		raceInfo.forEach(rabbit => {
            const id = rabbit.id
            const bet = rabbit.bet
            const place = rabbit.place
            const win = moneyPerWin * bet
            
            const indexFoundRabbit = rabbitList.findIndex((x) => x.id === id)

            if(place === indexFoundRabbit + 1){
                sum += win
            } else {
                sum -= bet
            }
		})		
		
        let race_payload = {
			uuid: user.uuid,
			game: "race",
			money: sum,
			status: sum > money ? "win" : "lose",
			bet: Math.abs(money - sum)
		}
		props.results(race_payload)
    }

    return <div className="game_container race_tables_container">
        <div className="game_box">
            {startRace ? <RaceGame 
                {...props} 
                bets={bets}
                raceInfo={raceInfo}
                rabbitArray={rabbitArray}
                width={width}
                images={images}
                startRace={startRace}
                handleExit={()=>handleExit()}
                handleRaceResults={(e)=>handleRaceResults(e)}
            /> : <RaceTables 
                {...props} 
                rabbitArray={rabbitArray}
                getData={(e)=>getData(e)}
            />}
        </div>
    </div>
}

export default Race