var constants = require('../var/constants')

function race(data, users_json){
    let monkey_race = false
    let rabbit_speed = [3, 1] //max, min
    let rabbit_delay = [40, 20] //max, min
    let user_found = get_user_from_uuid(data.uuid, users_json)
    var rabbit_race = constants.SERVER_RABBITS
    if(user_found){
        for(let i in rabbit_race){			
            rabbit_race[i].max_speed = rabbit_speed[0]
            rabbit_race[i].min_speed = rabbit_speed[1]

            let random_delay = Math.floor(Math.random() * (rabbit_delay[0] - rabbit_delay[1]) ) + rabbit_delay[1]
            rabbit_race[i].delay = random_delay
            
            rabbit_race[i].health_max = 5
            rabbit_race[i].health = Math.round(random_delay * rabbit_race[i].health_max / rabbit_delay[0] * 10) / 10
            
            rabbit_race[i].bet = 0
            rabbit_race[i].place = 1
        }
        return {rabbit_race: rabbit_race}
    } else {
        return null
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

module.exports = {race}