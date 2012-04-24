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
	
	function scanForNewAttachments(text){
		var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
		var regex = new RegExp(expression);
		var urls = text.match(regex);
		var result = {}
		for(index in urls){
			if(isNaN(index)) continue;
			
			var url = urls[index];
			if(! existingAttachments[url]){
				fetchURL(url, function(details){
					existingAttachments[url] = details;
					var form = generateAttachmentForm(details);
					$(settings.container).append(form);
				});
			}
		}
	}
	
	function fetchURL(url, callback){
		callback({url: url, title: url})
		// $.ajax('https://graph.facebook.com/', {
		// 	data: {
		// 		ids: url,
		// 	},
		// 	dataType: 'jsonp',
		// 	success: function(data, status, handle){
		// 		var result = data[url];
		// 		result['url'] = url;
		// 		if(! result['title']){
		// 			result['title'] = url;
		// 		}
		// 		callback(result);
		// 	},
		// 	error: function(handle, status, error){
		// 		console.log(status);
		// 		console.log(error);
		// 	}
		// })
	}
	
	function generateAttachmentForm(attachment){
		var closeLink = $('<a>').attr('class', "close").html('x');
		closeLink.click(function(){
			$(this).parents('.attachment').remove();
		});
		
		var node = $('<div>').attr('class', 'attachment');
		node.append($('<a>').attr('href', attachment.url).html(attachment.title));
		node.append(closeLink);
		return node;
	}
	
	function fieldChanged(elem, event){
		scanForNewAttachments($(elem).html());
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
