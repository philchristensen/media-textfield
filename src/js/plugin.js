(function($) {
	var settings;
	var existingAttachments = {};
	var timeoutID = null;
	
	var methods = {
		init: function(options){
			// Create some defaults, extending them with any options that were provided
			settings = $.extend({
				container: "#attachments",
			}, options);
			
			var elem = this;
			
			$('head').append($('<link>').attr('rel', "stylesheet").attr('href', "src/css/plugin.css").attr('type', "text/css").attr('media', "screen"));
			$(elem).attr('contenteditable', "true").addClass('media-text-area');
			
			$(this).bind('focus', function(){
				var $this = $(this);
				$this.data('before', $this.html());
				return $this;
			}).bind('blur keyup paste', function(){
				var $this = $(this);
				if($this.data('before') !== $this.html()){
					$this.data('before', $this.html());
					$this.trigger('change');
				}
				return $this;
			}).bind('change', function(e){
				if(timeoutID){
					clearTimeout(timeoutID);
				}
				timeoutID = window.setTimeout(function(){
					timeoutID = null;
					fieldChanged(elem, e);
				}, 2000)
			});
			
			return this;
		},
	};
	
	function scanForAttachments(text){
		var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
		var regex = new RegExp(expression);
		var urls = text.match(regex);
		var result = {}
		for(index in urls){
			if(isNaN(index)) continue;
			result[urls[index]] = {
				url: urls[index],
				title: urls[index],
			};
		}
		return result;
	}
	
	function generateAttachmentForm(attachment){
		return $('<div>').attr('class', 'attachment').append($('<a>').attr('href', attachment.url).html(attachment.title));
	}
	
	function fieldChanged(elem, event){
		var urls = scanForAttachments($(elem).html());
		for(key in urls){
			if(! existingAttachments[key]){
				existingAttachments[key] = urls[key];
				var form = generateAttachmentForm(urls[key]);
				$(settings.container).append(form);
			}
		}
	}
	
	$.fn.mediaTextfield = function(method){
		if(methods[method]){
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		else if(typeof method === 'object' || !method){
			return methods.init.apply(this, arguments);
		}
		else{
			$.error('Method ' +  method + ' does not exist on jQuery.mediaTextfield');
		}
	};
})(jQuery);
