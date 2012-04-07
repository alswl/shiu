(function() {
	var Chapter = function () {
		var self = this;
	};
    Chapter.prototype = {
        init: function (title, content) {
			var self = this;
			self.title = title;
			self.content = content;
			return self;
		},
	};
	window.Chapter = Chapter;
})();
