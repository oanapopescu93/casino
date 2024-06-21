function keno(data, how_lucky){
    let monkey_keno = false	
    let monkey = []
    let array = []
    let no_of_games = typeof data.no_of_games !== "undefined" ? data.no_of_games : 1
    let is_lucky = Math.floor(Math.random() * 100)
    if(is_lucky % how_lucky === 0){
        //monkey_keno = true
    }
    
    if(monkey_keno){ // it means the player must lose
        for(let i=0; i<no_of_games; i++){
            let arr = []
            array.push(arr)
        }
    } else {
        for(let i=0; i<no_of_games; i++){
            let arr = []
            while(arr.length < data.length){
                let r = Math.floor(Math.random() * data.max) + 1
                if(arr.indexOf(r) === -1) arr.push(r)
            }
            array.push(arr)
        }
    }
    return array
}

module.exports = {keno}