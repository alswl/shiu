(function () {
	'use strict';
	var Book = {

		// constructor
        init: function (book) {
			var self = this,
				i = 0,
				chapter;
			self.db = window.shiu.db.Db;
			self.title = book.title;
			self.author = book.author;
			self.chapters = [];
			for (i = 0; i < book.chapters.length; i += 1) {
				chapter = Object.create(window.shiu.model.Chapter).init(
					book.chapters[i].title,
					book.chapters[i].content,
					i
				);
				self.chapters.push(chapter);
			}
			return self;
		},

		// 页码保存到本地
		setCurrentPage: function (page) {
			var self = this;
			self.db.set(self.title + '_currentPage', page);
		},

		// 从本地获取页码
		getCurrentPage: function () {
			var self = this,
				page = self.db.get(self.title + '_currentPage');
			if (page === null || page > self.getPageCount()) {
				page = 0;
			}
			return page;
		},

		// 总页数保存到本地
		setPageCount: function (page) {
			var self = this;
			self.db.set(self.title + '_pageCount', page);
		},

		// 从本地获取总页码
		getPageCount: function () {
			var self = this;
			return self.db.get(self.title + '_pageCount');
		},

		// 章节
		setCurrentChapterIndex: function (index) {
			var self = this;
			this.db.set(self.title + '_currentChapterIndex', index);
		},
		getCurrentChapterIndex: function () {
			var self = this,
				index = self.db.get(self.title + '_currentChapterIndex');
			if (index === null || index > self.chapters.length) {
				index = 0;
			}
			return index;
		},
		getCurrentChapter: function () {
			var self = this;
			return self.chapters[self.getCurrentChapterIndex()];
		},

		getIndexsHtml: function () {
			var self = this,
				html = '',
				i;
			for (i = 0; i < self.chapters.length; i += 1) {
				html += '<li><a href="javascript:;" rel="' + i + '">' +
					self.chapters[i].getCnIndex() + self.chapters[i].title +
					'</a></li>';
			}
			return html;
		}
	};

	window.shiu.model.Book = Book;
}());
