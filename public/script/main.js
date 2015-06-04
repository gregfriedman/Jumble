requirejs.config({
	baseUrl: '/script',
    paths: {
        'jquery' : 'lib/jquery-1.9.0.min',
        'velocity' : 'lib/velocity.min',
        'packery' : 'lib/packery.pkgd',
        'draggabilly' : 'lib/draggabilly.pkgd.1.1.2'
    },
    shim: {
        'velocity' : {
            deps: ['jquery']
        }
    }
});

requirejs(['jquery', 'puzzle'], function( $, Puzzle) {
	
	'use strict';
	
	$(function(){

		//$('.puzzle-container').puzzle({
		//	word: 'casement',
		//	image: 'img/casement.png'
		//});
		
        var puzzle = new Puzzle('casement', 'senamect', $('.jumble-intro'), $('.jumble'));
		
		$('.start-button').on('click', function () {
			puzzle.start();
			$(this).hide();
		});
		
		$('.start-button').on('touchstart mousedown', function () {
			$(this).velocity({scale: .9}, 70);
		});
		$('.start-button').on('touchend mouseup', function () {
			$(this).velocity({scale: 1}, {easing: 'spring'});
		});
		
	});
});