function race(data, how_lucky){
    let monkey_race = false	
    let monkey = []
    let is_lucky = Math.floor(Math.random() * 100)
    if(is_lucky % how_lucky === 0){
        monkey_race = true
    }
    
    if(monkey_race){ // it means the player must lose
        
    }
    
    return {}
}

module.exports = {race}