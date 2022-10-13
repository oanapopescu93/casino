function keno(data, how_lucky, users_json){
    let monkey_keno = false
    let arr = []
    let user_found = get_user_from_uuid(data.uuid, users_json)
    if(user_found){
        let is_lucky = Math.floor(Math.random() * 100)
        if(is_lucky % how_lucky === 0){
            monkey_keno = true
        }        
        while(arr.length < data.length){
            let r = Math.floor(Math.random() * data.max) + 1
            if(arr.indexOf(r) === -1) arr.push(r)
        }
    }
    return arr
    
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

module.exports = {keno}