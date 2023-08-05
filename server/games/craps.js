function craps(data, how_lucky){
    let monkey_craps = false
    let is_lucky = Math.floor(Math.random() * 100)
    if(is_lucky % how_lucky === 0){
        monkey_craps = true
    }    
    let how_many_dices = data.how_many_dices
    let numbers = []
    let point = data.point
    let before = data.before
    let array = [2, 3, 7, 12]    
    numbers = set_numbers()
    
    while(numbers[0] == before[0] && numbers[1] == before[1]){
        numbers = set_numbers()
    }

    if(monkey_craps){//it means the user must lose
        if(point){
            //other rolls must be 2, 3, 7, 12
            if(numbers[0] + numbers[1] !== 2 && numbers[0] + numbers[1] !== 3 && numbers[0] + numbers[1] !== 7 && numbers[0] + numbers[1] !== 12){
                let t = Math.floor((Math.random() * 3) + 0)
                let mynumber = array[t]
                numbers[0] = Math.floor(mynumber/2)
                numbers[1] = mynumber-numbers[0]
            }
        } else {
            // first roll must not be 7
            if(numbers[0] + numbers[1] === 7){
                numbers[0]++
                if(numbers[0]>6){
                    numbers[0] = 1
                }
            }
        }
    }

    return numbers

    function set_numbers(){
        let my_numbers = []
        for(let i=0; i<how_many_dices; i++){
            let number = Math.floor((Math.random() * 6) + 1)			
            my_numbers.push(number)
        }
        return my_numbers
    }
}

module.exports = {craps}