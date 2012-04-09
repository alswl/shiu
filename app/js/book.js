(function() {
	var Book = {

		// constructor
        init: function (book) {
			var self = this;
			self.title = book.title;
			self.author = book.author;
			self.chapters = [];
			for (var i = 0; i < book.chapters.length; i++) {
				chapter = new Chapter().init(book.chapters[i].title, book.chapters[i].content);
				self.chapters.push(chapter);
			}
			return self;
		},

		// 页码保存到本地
		setCurrentPage: function(page) {
			db.set(self.title + 'currentPage', page);
		},

		// 从本地获取页码
		getCurrentPage: function() {
			var page = db.get(self.title + 'currentPage');
			if (page === null) {
				page = 0;
			}
			return page;
		},

		// 总页数保存到本地
		setPageCount: function(page) {
			db.set(self.title + 'pageCount', page);
		},

		// 从本地获取总页码
		getPageCount: function() {
			return db.get(self.title + 'pageCount');
		},

		// 章节
		setCurrentChapterIndex: function(index) {
			db.set(self.title + 'currentChapterIndex', index);
		},
		getCurrentChapterIndex: function() {
			index = db.get(self.title + 'currentChapterIndex');
			if (index === null) {
				index = 0;
			}
			return index;
		},
		getCurrentChapter: function() {
			return this.chapters[this.getCurrentChapterIndex()];
		},


	};

	window.Book = Book;
})();
