const pageReducer = (state = "salon", action) => {
	switch(action.type){
		case "game_page":						
			return action.page	
		default: 
			return state
	}
}
export default pageReducer