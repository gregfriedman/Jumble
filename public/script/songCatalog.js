define(['song'], function (Song) {
	
	function SongCatalog() {
		
		if ( !(this instanceof SongCatalog)) {
			return new SongCatalog();
		}
		
		var getSongById = function(id) {
			return new Song(id);
		}

		return {
			getSongById: getSongById
		}
	}

	return SongCatalog;
});

//(function(window) {
//	
//	function SongCatalog() {
//	
//		function getLatest() {
//			return new Song();
//		}
//		
//		return {
//			getLatest: getLatest
//		}
//	}
//	
//	window.asam = window.asam || {};
//	window.asam.SongCatalog = SongCatalog;
//})(window);