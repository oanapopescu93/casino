const visibilityReducer = (state = "game", action) => {	
	switch(action.type){
		case "game_visible":						
			return action.visibility			
		default: 
			return state
	}
}
export default visibilityReducer