(function($) {
	var settings;
	
	function scanForAttachments(text){
		
	}
	
	function generateAttachmentForm(attachment){
		
	}
	
	function fieldChanged(elem, event){
		var urls = [];
	}
	
	var methods = {
		init: function(options){
			// Create some defaults, extending them with any options that were provided
			settings = $.extend({
				
			}, options);
			
			$('head').append($('<link>').attr('rel', "stylesheet").attr('href', "src/css/plugin.css").attr('type', "text/css").attr('media', "screen"));
			$(this).addClass('media-text-area');
			$(this).change(function(e){
				fieldChanged(this, e)
			});
			
			
			return this;
		},
	};
	
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
