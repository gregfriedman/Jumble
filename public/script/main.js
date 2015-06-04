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

requirejs(['jquery', 'signup', 'puzzle'], function( $, signUp, Puzzle) {
	
	soundManager.url = '/swf/';
	soundManager.flashVersion = 9;
	soundManager.useFlashBlock = false;
	soundManager.useHighPerformance = true;
	soundManager.wmode = 'transparent';
	soundManager.useFastPolling = true;
	soundManager.useHTML5Audio = true;
	soundManager.preferFlash = false;
	
	$(function(){

		//$('.puzzle-container').puzzle({
		//	word: 'casement',
		//	image: 'img/casement.png'
		//});
		
        var puzzle = new Puzzle();
		puzzle.init();

        $('.track').on('click', function(event){
            event.preventDefault();
            
            // Create a track variable, grab the data from it, and find out if it's already playing *(set to active)*

            var $track = $(this),
                data = $track.data('track'),
                isPlaying = $track.is('.icon-pause');
            
            if ( $track.is('.loading')) {
                return;
            }

            if ( isPlaying ) {

                soundManager.pause('track_' + data.id);

            } else {

                if ( $('.track').not($track).hasClass('.icon-pause') ) {
                    soundManager.stopAll();
                }

                soundManager.play('track_' + data.id );

            }
        });
        
		soundManager.onready(function() {
			
			var consumer_key = "f46b5e86eecfd1102aa862885bea0670";
			var url = "https://soundcloud.com/greg-friedman-music/sets/a-song-a-month";

			//preparePlaylist();
			
			var $trackLink = $('.track');
			$trackLink.data('track', {id: 208381463} );
			prepareTrack(208381463, 'https://api.soundcloud.com/tracks/208381463/stream', $trackLink);
			
            $trackLink.removeClass('loading');
            $trackLink.addClass('icon-play');
            
			function prepareTrack(trackId, url, $trackLink) {
				
				(url.indexOf("secret_token") == -1) ? url = url + '?' : url = url + '&';
				url = url + 'consumer_key=' + consumer_key;
				
				var sound = soundManager.createSound({
					id: 'track_' + trackId,
					url: url,
					onplay: function () {
						$trackLink.closest('.player').addClass('playing');
						$trackLink.removeClass('icon-play');
						$trackLink.addClass('icon-pause');
					},
					onresume: function () {
						$trackLink.closest('.player').addClass('playing');
						$trackLink.removeClass('icon-play');
						$trackLink.addClass('icon-pause');
					},
					onpause: function () {
						$trackLink.closest('.player').removeClass('playing');
						$trackLink.removeClass('icon-pause');
						$trackLink.addClass('icon-play');
					},
					onstop: function () {
						$trackLink.closest('.player').addClass('playing');
						$trackLink.text('Play album track');
						$trackLink.removeClass('active');
					},
					onfinish: function () {
						$trackLink.closest('.player').removeClass('playing');
						$trackLink.removeClass('icon-pause');
						$trackLink.addClass('icon-play');

						onTrackFinished();
					}
				});
			}

			function preparePlaylist() {
				$.getJSON('http://api.soundcloud.com/resolve?url=' + url + '&format=json&consumer_key=' + consumer_key + '&callback=?', function (playlist) {
					$.each(playlist.tracks, function (index, track) {
						var $trackLink = $('.track[href="' + track.permalink_url + '"]');
						$trackLink.data('track', track);
						// * Get appropriate stream url depending on whether the playlist is private or public.
						// * If the track includes a *secret_token* add a '&' to the url, else add a '?'.
						// * Finally, append the consumer key and you'll have a working stream url.
						var url = track.stream_url;
						prepareTrack(track.id, url, $trackLink);
					});
				});
			}
			
			function onTrackFinished() {
				signUp.promptForEmail();
			}
			
			// I'd like a way to be able to put this into TEST mode. Right now it's pretty ugly how I'm doing it. Would like to figure out
			// 	how to make this into a module and pass in a test parameter.
			if ( typeof isTest != 'undefined' && isTest === true ) {
				$('.track').on('click', function(event) {
					event.preventDefault();
					onTrackFinished();
				})
			}
			
			// Bind a click event to each list item we created above.
	

	
		});

	
		$('form .sign-up-button').click( function(event) {
			event.preventDefault();
			$(this).closest('form').submit();
		});
		
	});
});