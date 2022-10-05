const loadReducer = (state = false, action) => {
	switch(action.type){
		case "game_load":						
			return action.load		
		default: 
			return state
	}
}
export default loadReducer