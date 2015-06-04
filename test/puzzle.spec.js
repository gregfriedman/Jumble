var requirejs = require('requirejs'),
	jsdom = require('jsdom'),
	should = require('should');

requirejs.config({
	baseUrl: 'public/script',
	paths: {
		'jquery': 'lib/jquery-1.9.0.min'
	}
});

describe('puzzle', function () {
	context("when initialized with word", function() {
		var puzzle;

		before(function (done) {
			//var jquery = requirejs('jquery')( {} );
			var doc = jsdom.jsdom('<html><body></body></html>');
			window = doc.parentWindow;
			$ = global.jQuery = require('jquery')(window);
			
			requirejs(['puzzle'], function (Puzzle) {
				puzzle = new Puzzle('casement');
				done();
			});
		});

		it('should return number of letters', function () {
			puzzle._getLetterCount().should.equal('casement'.length);
		});

		//it('should be loading when created', function () {
		//	var song = songCatalog.getSongById(10);
		//	song.isLoading.should.equal(true);
		//});
	})
});