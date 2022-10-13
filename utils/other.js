function sort_array_obj(array, sort_by){
	let sorted = false
	switch (typeof sort_by) {
		case 'string': // sort array of objects
			while (!sorted){
				sorted = true
				for(let i=0; i<array.length-1; i++){
					if (array[i][sort_by] > array[i+1][sort_by]) {
						let t = array[i+1]
						array[i+1] = array[i]
						array[i] = t
						sorted = false
					  }
				}
			}			
			break
		case 'undefined': // sort a simple array
			while (!sorted){
				sorted = true
				for(let i=0; i<array.length-1; i++){
					if (array[i] > array[i+1]) {
						let t = array[i+1]
						array[i+1] = array[i]
						array[i] = t
						sorted = false
					  }
				}
			}
			break			
	}
  	
}
function get_room_name(data, x){
	let room_name = data.game_choice.table_name ? data.game_choice.table_name : data.game_choice
	if(data.game_choice.table_id){
		room_name += '_' + data.game_choice.table_id
	}
	if(data.game_choice.table_type){
		room_name += '_' + data.game_choice.table_type
	}
	return room_name
}
function get_user_from_uuid(uuid, users_array){
	let user_found
	for(let i in users_array){
		if(users_array[i].uuid == uuid){
			user_found = users_array[i]									
			break
		}
	}
	return user_found
}
function get_device(headers){
	let device = 0 // 0 = computer, 1 = mobile, 2 = other
	if(headers){
		if(typeof headers["user-agent"] !== "undefined" || headers["user-agent"] !== "null" || headers["user-agent"] !== null || headers["user-agent"] !== ""){
			if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(headers["user-agent"]) ) {
				device = 1
			}
		} else {
			device = 2
		}
	}
	return device
}
function check_streak(result){
	const DAYS = 2
	const DAY_SPAN = DAYS * 24
	let streak = 1

	for(let i = 0; i < result.length-1; i++){
		let date01 = new Date(parseInt(result[i].login_date))
		var day01 = date01.getDate()			
		let date02 = new Date(parseInt(result[i+1].login_date))
		var day02 = date02.getDate()
		let period = parseInt(result[i+1].login_date)-parseInt(result[i].login_date)
		let hours = period / 3600000

		if(hours < DAY_SPAN && day01 != day02){
			// less then two days span, but not the same day
			streak++
		} else if(hours < DAY_SPAN && day01 == day02){
			// he logged again in the same day
		} else {
			// he missed a day or more
			streak = 1
		}
	}
	return streak
}
function chatMessage(from, text){
	return {from: from, text:text, time: new Date().getTime()} 
}
function get_extra_data(){
	return new Promise(function(resolve, reject){
		axios.get('https://ipgeolocation.abstractapi.com/v1/?api_key=2813994f865540fe848c8bcb293ec74c')
		.then(response => {
			resolve(response)	
		}).catch(error => {
			resolve('get_extra_data--> ', error)
		})
	})
}

module.exports = {
	sort_array_obj,
	get_room_name,
	get_user_from_uuid,
	get_device,
	check_streak,
	chatMessage,
	get_extra_data,
}