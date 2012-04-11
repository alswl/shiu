(function() {
	var Chapter = function () {
		var self = this;
	};
    Chapter.prototype = {
        init: function(title, content, index) {
			this.title = title;
			this.content = content;
			this.index = index;

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
				self.$ = self.$Template.replace('{title}', self.getCnIndex() + self.title).replace('{contents}', contentHtml);
			}
			return self.$;
		},

		// 获取中文的「第 N 章」
		getCnIndex: function() {
			return "第" + util.numberToChinese(this.index + 1) + "章 ";
		}
	};
	window.Chapter = Chapter;
})();
