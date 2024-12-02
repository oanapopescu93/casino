const axios = require('axios')

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
  	return array
}
function get_device(headers){
	let device = 0 // 0 = computer, 1 = mobile, 2 = other
	if(headers){
		if (headers && typeof headers["user-agent"] === "string" && headers["user-agent"].trim() !== "") {
			const userAgent = headers["user-agent"].toLowerCase()
			if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile safari|windows phone|silk-accelerated/i.test(userAgent)) {
				device = 1; // Mobile
			} else if (/tablet|ipad|android(?!.*mobile)/i.test(userAgent)) {
				device = 1; // Tablet
			} else {
				device = 0; // Assuming non-mobile devices as computers
			}
		} else {
			device = 2; // Other or undefined
		}
	}
	return device
}
function check_streak(array) {
	const MS_IN_A_DAY = 24 * 60 * 60 * 1000 // Milliseconds in a day
	let streak = 1
  
	// Sort the array by login_date in ascending order
	array.sort((a, b) => parseInt(a.login_date) - parseInt(b.login_date))
  
	for (let i = 0; i < array.length - 1; i++) {
	  const currentDate = new Date(parseInt(array[i].login_date))
	  const nextDate = new Date(parseInt(array[i + 1].login_date))
  
	  // Normalize dates to midnight for comparison
	  const currentDay = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate())
	  const nextDay = new Date(nextDate.getUTCFullYear(), nextDate.getUTCMonth(), nextDate.getUTCDate())
  
	  const dayDifference = (nextDay - currentDay) / MS_IN_A_DAY
  
	  if (dayDifference === 1) { // Consecutive day login		
		streak++
	  } else if (dayDifference > 1) { // Break in streak		
		streak = 1
	  }
	  // If `dayDifference === 0`, ignore since it's the same day
	}
  
	return streak
  }  

function get_geolocation(apiKey) {
	return "https://api.ipgeolocation.io/ipgeo?apiKey=" + apiKey
}
function get_extra_data(){
	return new Promise((resolve, reject)=>{
		let url = get_geolocation('3b154170258741fb81976e7f34d61938')
		axios.get(url).then(response => {
			resolve(response)	
		}).catch(error => {
			console.log('get_extra_data_error--> ', error)
			resolve(false)
		})
	})
}

function get_exchangerate_api(apiKey) {
	return "https://v6.exchangerate-api.com/v6/" + apiKey + "/latest/USD"
}
function get_exchangerate(){
	return new Promise((resolve, reject)=>{
		let url = get_exchangerate_api('3e2179a6f6b4ea34c973f0d5')
		axios.get(url).then(response => {
			resolve(response)	
		}).catch(error => {
			console.log('get_exchangerate_error--> ', error)
			resolve(false)
		})
	})
}
function filterRates(rates, allowedCurrencies){
	let filteredRates = {}
    for (let currency of allowedCurrencies) {
        if (rates[currency] !== undefined) {
            filteredRates[currency] = rates[currency]
        }
    }
    return filteredRates
}

module.exports = {
	sort_array_obj,
	get_device,
	check_streak,
	get_extra_data,
	get_exchangerate,
	filterRates,
}