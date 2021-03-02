const visibilityReducer = (state = true, action) => {	
	//console.log("visibility0-- ", action);
	switch(action.type){
		case "game_visible":						
			return action.visibility;			
		default: 
			return state;
	}
}

export default visibilityReducer;