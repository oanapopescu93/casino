const popupReducer = (state = null, action) => {	
	switch(action.type){
		case "popup_info":						
			return action.info			
		default: 
			return state
	}
}
export default popupReducer