function sort_array_obj(array, sort_by){
	var sorted = false;
	switch (typeof sort_by) {
		case 'string': // sort array of objects
			while (!sorted){
				sorted = true;
				for(var i=0; i<array.length-1; i++){
					if (array[i][sort_by] > array[i+1][sort_by]) {
						var t = array[i+1];
						array[i+1] = array[i];
						array[i] = t;
						sorted = false;
					  }
				}
			}			
			break;
		case 'undefined': // sort a simple array
			while (!sorted){
				sorted = true;
				for(var i=0; i<array.length-1; i++){
					if (array[i] > array[i+1]) {
						var t = array[i+1];
						array[i+1] = array[i];
						array[i] = t;
						sorted = false;
					  }
				}
			}
			break;				
	}
  	
}

module.exports = {
    sort_array_obj,
};