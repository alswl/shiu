(function() {
	var Book = {

		// constructor
        init: function (book) {
			var self = this;
			self.title = book.title;
			self.author = book.author;
			self.chapters = [];
			for (var i = 0; i < book.chapters.length; i++) {
				var chapter = new Chapter().init(book.chapters[i].title, book.chapters[i].content, i);
				self.chapters.push(chapter);
			}
			return self;
		},

		// 页码保存到本地
		setCurrentPage: function(page) {
			db.set(self.title + '_currentPage', page);
		},

		// 从本地获取页码
		getCurrentPage: function() {
			var page = db.get(self.title + '_currentPage');
			if (page === null) {
				page = 0;
			}
			return page;
		},

		// 总页数保存到本地
		setPageCount: function(page) {
			db.set(self.title + '_pageCount', page);
		},

		// 从本地获取总页码
		getPageCount: function() {
			return db.get(self.title + '_pageCount');
		},

		// 章节
		setCurrentChapterIndex: function(index) {
			db.set(self.title + '_currentChapterIndex', index);
		},
		getCurrentChapterIndex: function() {
			index = db.get(self.title + '_currentChapterIndex');
			if (index === null) {
				index = 0;
			}
			return index;
		},
		getCurrentChapter: function() {
			return this.chapters[this.getCurrentChapterIndex()];
		},

		getIndexsHtml: function() {
			var self = this;
			var html = ''
			for (var i = 0; i < self.chapters.length; i++) {
				html += '<li><a href="javascript:;" rel="'+ i + '">'+ self.chapters[i].getCnIndex() + self.chapters[i].title + '</a></li>';
			}
			return html;
		},
	};

	window.Book = Book;
})();
