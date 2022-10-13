var constants = require('../var/constants')

function slots(data, how_lucky, users_json, sockets){
    let monkey_slots = false
    let array_big = []
    let reel = data.reel
    let items = data.items
    let matrix = []
    let reason = data.reason
    let user_found = get_user_from_uuid(data.uuid, users_json)
    let slot_prize = constants.SLOT_PRIZE

    if(user_found){
        let id = user_found.id

        for(let i=0; i<19; i++){
            matrix.push(slot_matrix(i, [reel, 3]))
        }

        if(reason != "resize"){
            for(let i=0; i<reel; i++){
                let array_small = Array.from(Array(items).keys())
                array_small = shuffleArray(array_small)
                array_big.push(array_small)
            }	
        }
            
        for(let i in sockets){
            if(sockets[i].user_id === id){
                let is_lucky = Math.floor(Math.random() * 100)
                if(is_lucky % how_lucky === 0){
                    monkey_slots = true
                }
                break
            } 
        }
        return [array_big, matrix, monkey_slots]
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
        let my_prize = slot_prize[x]
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

    function get_user_from_uuid(uuid, users_json){
        let user_found
        for(let i in users_json){
            if(users_json[i].uuid == uuid){
                user_found = users_json[i]									
                break
            }
        }
        return user_found
    }
}

module.exports = {slots}