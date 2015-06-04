define(function() {
	
	var songConstructor = function Song(id) {
		if ( !(this instanceof Song)) {
			return new Song(id);
		}
		this.id = id;
		this.isLoading = true;
	}
	
	return songConstructor;
});