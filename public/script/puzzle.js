define(['jquery', 'velocity', 'packery', 'draggabilly'], function ($, velocity, Packery, Draggabilly) {

	'use strict';
	
	function Puzzle() {
		
		var _packedContainer = null;

		function animateLettersGoHome() {
			var jumbleOffset = $('.jumble').offset();
			$('.jumble-intro .letter').velocity({
				left: function (i) {
					return jumbleOffset.left + (i * 35);
				},
				top: function () {
					return jumbleOffset.top;
				},
				rotateZ: function () {
					return 0;
				}
			}, {
				easing: 'ease-in-out', delay: 1000, complete: function () {
					animateLettersSwap();
				}
			});
		}

		function animateLettersSwap() {
			$('.jumble-intro .letter:nth-child(4)').velocity({top: "-=40"}, {
				duration: 200, delay: 200,
				begin: function () {
					$(this).addClass('is-dragging');
				},
				complete: function () {
					$('.jumble-intro .letter:nth-child(4)')
						.velocity({left: "+=35"})
						.velocity({top: "+=40"}, {
							begin: function () {
							},
							complete: function () {
								$(this).removeClass('is-dragging');
								$('.jumble .letter').css({opacity: 1});
								$('.jumble-intro').hide();
								packLetters();
								_packedContainer.stamp($('.stamp'));
							}
						});
					$('.jumble-intro .letter:nth-child(5)').velocity({left: "-=35"}, {
						duration: 200, delay: 200 });
				}
			});
		}

		function animateWindowEnter() {

			$('.windows').velocity({left: [0, 2000]}, {
				duration: 200, easing: "ease-in", complete: function () {
					$('.casement-window')
						.velocity({translateX: "-50px", scaleX: "1.5", scaleY: ".75"}, {
							easing: "ease-out",
							duration: 70
						})
						.velocity({translateX: "-60px", scaleX: "1.6", scaleY: ".7"}, {
							easing: "ease-out",
							duration: 100
						})
						.velocity({translateX: "0", scaleX: "1", scaleY: "1"}, {easing: [300, 15], delay: 100});

					$('.legend')
						.velocity({translateX: [-150, 800]}, {duration: 200, easing: "ease-out"})
						.velocity({translateX: -175}, {duration: 150, easing: "ease-out"})
						.velocity({translateX: "0"}, {easing: [200, 15]});

					animateLettersGoHome();
				}
			});
		};

		function packLetters() {
			var $container = $('.jumble');
			var letterWidth = $('.letter', $container).outerWidth();
			var letterHeight = $('.letter', $container).outerHeight();

			_packedContainer = new Packery('.jumble', {
				columnWidth: letterWidth,
				rowHeight: letterHeight,
				gutter: 5
			});

			$container.find('.letter:not(.stamp)').each(function (i, itemElem) {
				var draggie = new Draggabilly(itemElem);
				draggie.on('dragStart', function () {
					$('.jumble.touch').addClass('in-drag')
				});
				draggie.on('dragEnd', function () {
					$('.jumble.touch').removeClass('in-drag')
				});
				_packedContainer.on('dragItemPositioned', function () {
					checkAnswer();
				});
				_packedContainer.bindDraggabillyEvents(draggie);
			});
			_packedContainer.stamp($('.stamp'));
		}

		function checkAnswer() {
			var $letters = $('.jumble .letter');

			$letters.sort(function (a, b) {
				return $(a).offset().left - $(b).offset().left
			});

			var word = $letters.map(function () {
				return $(this).data('letter');
			})
				.get()
				.join('');

			var wordToMatch = 'CASEMENT'; //'MSACTEEN';
			if (word.toUpperCase() == wordToMatch) {
				$('body').removeClass('intro');
				$('.wrap').show();
				$('.letter').addClass('stamp');
				$('.casement-window')
					.css({'transform-origin': 'center, center'})
					.velocity({scaleX: 1.25, scaleY: 1.25}, {easing: 'ease-in', duration: 200, delay: 200})
					.velocity({scaleX: 1, scaleY: 1}, {
						easing: 'spring', duration: 700, complete: function () {
							$('.main')
								.velocity({translateX: -100}, {duration: 300, easing: 'ease-in-out'})
								.velocity({translateX: 2000}, {
									duration: 200, easing: 'ease-in', complete: function () {
										$('.main').hide();
									}
								})
						}
					});
			}
		}

		function getFixedStartPosition() {
			return {
				left: function () {
					return $('.start-button').offset().left;
				},
				top: function () {
					return $('.start-button').offset().top;
				}
			}
		}

		function getRandomEndPosition() {
			var constrainedViewportWidth = $(window).width() - 200;// TODO: magic number
			var constrainedViewportHeight = $(window).height() - 200;// TODO: magic number
			return {
				opacity: 1,
				left: function () {
					return Math.random() * (constrainedViewportWidth);
				},
				top: function () {
					return Math.random() * (constrainedViewportHeight);
				},
				rotateZ: function () {
					return Math.random() * 360;
				}
			}
		}

		function sprayLetters() {
			$('.jumble-intro .letter').each(function (index) {
				// TODO: magic numbers
				var duration = Math.random() * 200 + ( index * 100);
				$(this)
					.velocity(getFixedStartPosition(), {easing: "ease-in-out", duration: 50})
					.velocity(getRandomEndPosition(), {
						easing: "ease-in-out", duration: duration,
						complete: function () {
							if (index === $('.jumble .letter').length - 1) {
								animateWindowEnter();
							}
						}
					});
			});
		}

		return {
			init: function () {

				$('.start-button').on('click', function () {
					sprayLetters();
					$(this).hide();
				});

				$('.start-button').on('touchstart mousedown', function () {
					$(this).velocity({scale: .9}, 70);
				});
				$('.start-button').on('touchend mouseup', function () {
					$(this).velocity({scale: 1}, {easing: 'spring'});
				});
			}
		}
	}
	
	return Puzzle;
});
