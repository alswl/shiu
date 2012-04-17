(function () {
	'use strict';
	var Chapter = {
        init: function (title, content, index) {
			this.title = title;
			this.content = content;
			this.index = index;

			return this;
		},
		// 获取 html
		get$: function () {
			var self = this,
				contentHtml,
				i;
			if (self.$ === undefined) {
				self.$Template = '<section class="chapter">\n' +
					'<h2>{title}</h2>\n' +
					'{contents}\n' +
					'<span class="end"></span>\n' +
					'</section>';
				contentHtml = '';
				for (i = 0; i < self.content.split('\r').length; i += 1) {
					contentHtml += '<p>' + self.content.split('\r')[i] + '</p>\n';
				}
				self.$ = self.$Template.replace('{title}', self.getCnIndex() + ' ' +
					self.title).replace('{contents}', contentHtml);
			}
			return self.$;
		},

		// 获取中文的「第 N 章」
		getCnIndex: function () {
			return "第" + window.shiu.util.numberToChinese(this.index + 1) +
				"章";
		}
	};
	window.shiu.model.Chapter = Chapter;
}());
