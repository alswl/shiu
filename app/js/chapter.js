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
				self.$ = self.$Template.replace('{title}', self.getCnIndex() + self.title).replace('{contents}', contentHtml);
			}
			return self.$;
		},

		// 获取中文的「第 N 章」
		getCnIndex: function() {
			var cnNumArr = "一二三四五六七八九十";
			var cnNum = (self.index + 1 >= 20 ? cnNumArr.charAt(parseInt(self.index + 1 / 10) - 1) : "")
				+ (self.index + 1 >= 10 ? cnNumArr.charAt(9) : "")
				+ (self.index + 1 % 10 == 0 ? "" : cnNumArr.charAt(self.index + 1 % 10 - 1));
			return "第" + cnNum + "章 ";
		}
	};
	window.Chapter = Chapter;
})();
