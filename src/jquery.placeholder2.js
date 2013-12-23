$(function() {
	// for IE9- only temporarily
	if (document.documentMode === undefined || document.documentMode > 9) {
		return;
	}
	
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
	var handle = function(index) {
		var input = this, $input = $(input);
		var text = $input.attr('placeholder');
		if (text === '') {
			return true;
		}
		if ($input.data('placeholder2-enabled')) {
			return true;
		}
		var height = getBoundingClientRect2(input).height;
		if (height === 0) {
			return true;
		}
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
		var $ph = $('<div class="placeholder2 ' + (options['class'] || '') + '" style="' + style + '">' + text + '</div>');
		$ph.insertAfter($input).on('click', function() {
			$input.focus();
		});
		var eventType = document.documentMode <= 9 ? 'keyup.placeholder2' : 'input.placeholder2';
		$input.on(eventType, function() {
			input.value === '' ? $ph.width('auto') : $ph.width('0');
		});
		// for autocomplete pair-fill
		if (options.link && $(options.link).length > 0) {
			$(options.link).on(eventType, function() {
				setTimeout(function() {
					$input.triggerHandler(eventType);
				}, 0);
			});
		}
		// for IE autocomplete not firing any event
		if (options.autoRefresh && document.documentMode) {
			setInterval(function() {
				$input.triggerHandler(eventType);
			}, 500);
		}
		$input.data('placeholder2-enabled', true);
	};
	$('input[placeholder]').each(handle);
	
	$.fn.extend({
		placeholder2: function() {
            return this.each(handle);
        }
    });
});
