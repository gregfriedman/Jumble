var requirejs = require('requirejs');
require('should');

requirejs.config({
	baseUrl: 'public/script'
});

describe('song catalog', function () {

	var songCatalog;

	before(function (done) {
		requirejs(['songCatalog'], function (SongCatalog) {
			songCatalog = new SongCatalog();
			done();
		});
	});

	it('should return correct song', function () {
		var song = songCatalog.getSongById(10);
		song.id.should.equal(10);
	});

	it('should be loading when created', function () {
		var song = songCatalog.getSongById(10);
		song.isLoading.should.equal(true);
	});
});