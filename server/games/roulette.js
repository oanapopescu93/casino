function roulette(data, how_lucky){
    let monkey_roulette = false	
    let monkey = []
    let is_lucky = Math.floor(Math.random() * 100)
    if(is_lucky % how_lucky === 0){
        monkey_roulette = true
    }
    
    if(monkey_roulette){ // it means the player must lose
        monkey = get_monkey_for_roulette(data.bet)
    }
    
    let spin_time = Math.floor(Math.random() * (800 - 300)) + 300
    let ball_speed = 0.06
    let k = Math.floor(Math.random() * (monkey.length-1 - 0)) + 0

    return {arc: 0.05, spin_time: spin_time, ball_speed: ball_speed, monkey: monkey[k]}

    function get_monkey_for_roulette(bets){
        let array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]
        let subarray = []
        for(let i in bets){
            if(isNaN(bets[i].text) === false){ // he bet on a number
                subarray.push(parseInt(bets[i].text)) //0 and 00 will be treated the same
            }
            if(bets[i].text == "1st 12"){
                subarray = subarray.concat([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
            }
            if(bets[i].text == "2st 12"){
                subarray = subarray.concat([13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24])
            }
            if(bets[i].text == "3st 12"){
                subarray = subarray.concat([25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36])
            }
            if(bets[i].text == "1-18"){
                subarray = subarray.concat([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18])
            }
            if(bets[i].text == "Even"){
                subarray = subarray.concat([2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36])
            }
            if(bets[i].text == "reds"){
                subarray = subarray.concat([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36])
            }
            if(bets[i].text == "blacks"){
                subarray = subarray.concat([2, 4, 6, 8, 10, 11, 12, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35])
            }
            if(bets[i].text == "Odd"){
                subarray = subarray.concat([1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35])
            }
            if(bets[i].text == "19-36"){
                subarray = subarray.concat([19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36])
            }
            if(bets[i].text == "2 to 1a"){
                subarray = subarray.concat([3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36])
            }
            if(bets[i].text == "2 to 1b"){
                subarray = subarray.concat([2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35])
            }
            if(bets[i].text == "2 to 1c"){
                subarray = subarray.concat([1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34])
            }
        }
    
        const difference = array.filter(function(el){
            return subarray.indexOf(el) < 0
        })
        return difference
    }
}

module.exports = {roulette}