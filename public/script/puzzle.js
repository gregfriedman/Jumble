define(['jquery', 'velocity', 'packery', 'draggabilly'], function ($, velocity, Packery, Draggabilly) {

	'use strict';

	function Puzzle(word, scrambledWord, $introElement, $element) {
		this.word = word;
		this.$introElement = $introElement;
		this.$element = $element;

		scrambledWord.split('').map(function (letter) {
			$('<div></div>')
				.addClass('letter')
				.text(letter)
				.appendTo($introElement);

			$('<div></div>')
				.addClass('letter')
				.text(letter)
				.attr('data-letter', letter)
				.appendTo($element);
		});

		// we want to demonstrate how letters are moved 
		var $swapLetter = $('.letter:nth-child(5)', $introElement);
		$swapLetter.insertBefore($swapLetter.prev());

		// make some of the letters fixed in place to make jumble easier to solve
		$('.letter:nth-child(5)', $element).addClass('stamp');
		$('.letter', $element).last().addClass('stamp');
		$('.letter', $introElement).last().addClass('stamp');
	}

	Puzzle.prototype.start = function () {
		this.sprayLetters();
	}

	Puzzle.prototype.sprayLetters = function () {

		var puzzle = this;

		$('.letter', puzzle.$introElement).each(function (index) {
			var baseDuration = 200;
			var durationIncrement = 100;
			var letterSpecificDuration = (index * durationIncrement);
			var duration = Math.random() * baseDuration + letterSpecificDuration;
			$(this)
				.velocity(getFixedStartPosition($('.start-button')), {easing: "ease-in-out", duration: 50})
				.velocity(getRandomEndPosition(), {
					easing: "ease-in-out", duration: duration,
					complete: function () {
						if (index === puzzle._getLetterCount() - 1) {
							puzzle._animateWindowEnter();
						}
					}
				});
		});
	}

	Puzzle.prototype.checkAnswer = function () {
		var $letters = $('.letter', this.$element);

		// sort the letters by their actual adjusted positions
		$letters.sort(function (a, b) {
			return $(a).offset().left - $(b).offset().left
		});

		var spelledWord = $letters.map(function () {
			return $(this).attr('data-letter');
		}).get().join('');

		var wordToMatch = this.word;
		if (spelledWord.toUpperCase() == wordToMatch.toUpperCase()) {
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

	Puzzle.prototype._packLetters = function () {
		var puzzle = this;

		var $container = puzzle.$element;
		var letterWidth = $('.letter', $container).outerWidth();
		var letterHeight = $('.letter', $container).outerHeight();

		var packedContainer = new Packery($container.get(0), {
			columnWidth: letterWidth,
			rowHeight: letterHeight,
			gutter: 5
		});

		$container.find('.letter:not(.stamp)').each(function (i, itemElem) {
			var draggie = new Draggabilly(itemElem);
			draggie.on('dragStart', function () {
				$container.addClass('in-drag')
			});
			draggie.on('dragEnd', function () {
				$container.removeClass('in-drag')
			});
			packedContainer.on('dragItemPositioned', function () {
				puzzle.checkAnswer();
			});
			packedContainer.bindDraggabillyEvents(draggie);
		});
		packedContainer.stamp($('.stamp'));

		return packedContainer;
	}

	Puzzle.prototype._getLetterCount = function () {
		return this.word.length;
	}

	Puzzle.prototype._animateWindowEnter = function () {
		var puzzle = this;

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

				puzzle._animateLettersGoHome();
			}
		});
	};

	Puzzle.prototype._animateLettersGoHome = function () {
		var puzzle = this;
		var jumbleOffset = puzzle.$element.offset();
		$('.letter', puzzle.$introElement).velocity({
			left: function (i) {
				var letterWidth = 30 + 5;
				return jumbleOffset.left + (i * letterWidth);
			},
			top: function () {
				return jumbleOffset.top;
			},
			rotateZ: function () {
				return 0;
			}
		}, {
			easing: 'ease-in-out', delay: 1000, complete: function () {
				puzzle._animateLettersSwap();
			}
		});
	}

	Puzzle.prototype._animateLettersSwap = function () {
		var puzzle = this;
		var $demoLetter = $('.letter:nth-child(4)', puzzle.$introElement),
			letterWidth = 30 + 5,
			letterHeight = 30 + 10;
		$demoLetter.velocity({top: "-=" + letterHeight}, {
			duration: 200, delay: 200,
			begin: function () {
				$(this).addClass('is-dragging');
			},
			complete: function () {
				$(this)
					.velocity({left: "+=" + letterWidth})
					.velocity({top: "+=" + letterHeight}, {
						complete: function () {
							$(this).removeClass('is-dragging');
							$('.letter', puzzle.$element).css({opacity: 1});
							puzzle.$introElement.hide();
							var packedContainer = puzzle._packLetters();
							packedContainer.stamp($('.stamp'));
						}
					});
				$demoLetter.next().velocity({left: "-=" + letterWidth}, {
					duration: 200, delay: 200
				});
			}
		});
	}


	function getFixedStartPosition($element) {
		return {
			left: function () {
				return $element.offset().left;
			},
			top: function () {
				return $element.offset().top;
			}
		}
	}

	function getRandomEndPosition() {
		var constrainedViewportWidth = $(window).width() - 200;
		var constrainedViewportHeight = $(window).height() - 200;
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

	return Puzzle;
});
