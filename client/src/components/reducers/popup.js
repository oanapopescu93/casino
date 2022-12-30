const popupReducer = (state = "", action) => {	
	switch(action.type){
		case "popup_info":						
			return action.info			
		default: 
			return state
	}
}
export default popupReducer