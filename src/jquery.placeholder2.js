$(function() {
	var getBoundingClientRect2 = function(element) {
		var rect = element.getBoundingClientRect();
		if (typeof rect.width !== 'undefined') {
			return rect;
		}
		return {
			top: rect.top,
			bottom: rect.bottom,
			left: rect.left,
			right: rect.right,
			width: Math.abs(rect.right - rect.left),
			height: Math.abs(rect.bottom - rect.top)
		};
	};
	var getComputedStyle2 = function(element) {
		if (typeof window.getComputedStyle === 'undefined') {
			return element.currentStyle;
		}
		return window.getComputedStyle(element);
	};
	$('input[placeholder2]').each(function(index) {
		var input = this, $input = $(input);
		var text = $input.attr('placeholder2');
		if (text === '') {
			return true;
		}
		var height = getBoundingClientRect2(input).height;
		var style = 'height:' + height + 'px;line-height:' + (height -1) + 'px;';
		var inputPosition = $input.position();
		var inputStyle = getComputedStyle2(input);
		style += 'top:' + (
					inputPosition.top + 
					parseInt(inputStyle.marginTop, 10) + 
					parseInt(inputStyle.borderTopWidth, 10) + 
					(document.documentMode <= 8 ? 2 : 0)
				) + 'px;';
		
		style += 'left:' + (
					inputPosition.left + 
					parseInt(inputStyle.marginLeft, 10) + 
					parseInt(inputStyle.borderLeftWidth, 10) + 
					parseInt(inputStyle.paddingLeft, 10) +
					1
				) + 'px;';
		style += input.value === '' ? 'width:auto;' : 'width:0;';
		var options = eval( '({' + ($input.attr('placeholder2-options') || '') + '})' );
		style += options.style || '';
		var classes = 'placeholder2 ' + (options['class'] || '');
		var $ph = $('<div class="' + classes + '" style="' + style + '">' + text + '</div>');
		$ph.insertAfter($input).on('click', function() {
			$input.focus();
		});
		var eventType = document.documentMode <= 8 ? 'keyup' : 'input';
		$input.on(eventType, function() {
			input.value === '' ? $ph.width('auto') : $ph.width('0');
		});
		// for firefox autocomplete
		if (options.link && $(options.link).length > 0) {
			$(options.link).on(eventType, function() {
				setTimeout(function() {
					input.value === '' ? $ph.width('auto') : $ph.width('0');
				}, 0);
			});
		}
		// for firefox auto fill field with value after page loaded
		if (options.loadedRefresh) {
			$(window).on('load.placeholder2', function() {
				input.value === '' ? $ph.width('auto') : $ph.width('0');
				$(window).off('.placeholder2');
			});
		}
	});
});
