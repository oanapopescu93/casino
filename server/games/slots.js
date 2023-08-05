var constants = require('../var/home')
function slots(data){
    let array_big = []
    let items = 7
    let matrix = []
    let slot_prizes = constants.SLOT_PRIZES

    for(let i=0; i < 19; i++){
        matrix.push(slot_matrix(i, [data.lines, 3]))
    }    
    for(let i=0; i < data.lines; i++){
        let array_small = Array.from(Array(items).keys())
        array_small = shuffleArray(array_small)
        array_big.push(array_small)
    }	

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = parseInt(Math.random() * i)
            let tmp = array[i]
            array[i] = array[j]
            array[j] = tmp
        }
        return array
    }

    function slot_matrix(x, size){
        let matrix = []
        let t = 0
        let my_prize = slot_prizes[x]
        let length01 = size[0]
        let length02 = size[1]
        switch (x) {
            case 0:
            case 1:
            case 2:				
                for(let i=0; i < length01; i++){
                    matrix.push([x, i])
                }
                break
            case 3:	
            case 4:				
                for(let i=0; i < length01; i++){
                    if(i === 2){
                        t  = Math.round((length02-1) / 2)
                    } else {
                        if(x===3){
                            if(i===3 || i===4){
                                t = length02-1
                            }
                        } else {
                            t = length02-1
                            if(i === 3 || i === 4){
                                t=0
                            }
                        }
                    }
                    matrix.push([t, i])
                }
                break
            case 5:	
            case 6:				
                for(let i=0; i < length01; i++){
                    t = 0
                    if(x === 5){
                        if(i%2 !== 0){
                            t = length02 - 1
                        }
                    } else {
                        if(i%2 === 0){
                            t = length02 - 1
                        }
                    }
                    matrix.push([t, i])
                }
                break
            case 7:	
            case 8:				
                for(let i=0; i < length01; i++){
                    t = 0
                    if(x === 7){
                        if(i%2 !== 0){
                            t  = Math.round((length02-1) / 2)
                        }
                    } else{
                        if(i%2 === 0){
                            t  = Math.round((length02-1) / 2)
                        }
                    }
                    matrix.push([t, i])
                }
                break 	
            case 9:	
            case 10:				
                for(let i=0; i < length01; i++){
                    t = 1
                    if(x === 9){
                        if(i%2 !== 0){
                            t = 2
                        }
                    } else{
                        if(i%2 === 0){
                            t  = 0
                        }
                    }
                    matrix.push([t, i])
                }
                break
            case 11:	
            case 12:	
                t = (length01 - 1) / 2 + 1		
                for(let i=0; i < length01; i++){					
                    if(x === 11){
                        if(i <= (length01-1)/2){
                            t = i
                        } else {
                            t--
                        }						
                    } else{
                        if(i > (length01-1)/2){
                            t++
                        } else {
                            t--
                        }
                    }
                    matrix.push([t, i])
                }
                break
            case 11:	
            case 12:	
                t = (length01 - 1) / 2 + 1			
                for(let i=0; i < length01; i++){					
                    if(x === 11){
                        if(i <= (length01-1)/2){
                            t = i
                        } else {
                            t--
                        }						
                    } else{
                        if(i > (length01 - 1) / 2){
                            t++
                        } else {
                            t--
                        }
                    }
                    matrix.push([t, i])
                }
                break 	
            case 13:	
            case 14:		
                for(let i=0; i < length01; i++){
                    t = 1
                    if(i === (length01 - 1) / 2){
                        if(x === 13){
                            t = 0
                        } else{
                            t = (length01-1)/2
                        }	
                    }
                    matrix.push([t, i])
                }
                break	
            case 15:	
            case 16:
            case 17:
            case 18:		
                for(let i=0; i < length01; i++){					
                    if(x === 15 || x === 16){
                        t = (length01 - 1) / 2
                        if(i === (length01 - 1) / 2){
                            t = 0
                            if(x === 16){
                                t = 1
                            }
                        }			
                    } else{
                        t = 0
                        if(i === (length01-1)/2){
                            t = 1
                            if(x === 18){
                                t = (length01-1)/2
                            }
                        }		
                    }				
                    matrix.push([t, i])
                }
                break
        } 
        return {matrix_id: x, matrix:matrix, prize:my_prize}
    }
    
    return {array: array_big, matrix}
}

module.exports = {slots}