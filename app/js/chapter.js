(function() {
	var Chapter = function () {
		var self = this;
	};
    Chapter.prototype = {
        init: function(title, content) {
			this.title = title;
			this.content = content;

			return this;
		},
		// 获取 html
		get$: function() {
			var self = this;
			if (self.$ == undefined) {
				self.$Template = '<section class="chapter">\n' +
					'<h2>{title}</h2>\n' +
					'{contents}\n' +
					'</section>';
				var contentHtml = '';
				for (var i = 0; i < self.content.split('\r').length; i++) {
					contentHtml += '<p>' + self.content.split('\r')[i] + '</p>\n';
				}
				self.$ = self.$Template.replace('{title}', self.title).replace('{contents}', contentHtml);
			}
			return self.$;
		},
		click: function() {
		}
	};
	window.Chapter = Chapter;
})();
