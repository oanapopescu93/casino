const pageReducer = (state = "salon", action) => {	
	//console.log("page0-- ", action);
	switch(action.type){
		case "game_page":						
			return action.page;			
		default: 
			return state;
	}
}

export default pageReducer;