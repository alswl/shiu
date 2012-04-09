(function() {
	var Book = {

		currentPage: null, // 当前页码
		pageCount: null, 

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
			db.set('currentPage', page);
		},

		// 从本地获取页码
		getCurrentPage: function() {
			var page = db.get('currentPage');
			if (page === null) {
				page = 1;
			}
			return page;
		},

		// 总页数保存到本地
		setPageCount: function(page) {
			db.set('pageCount', page);
		},

		// 从本地获取总页码
		getPageCount: function() {
			return db.get('pageCount');
		},



	};

	window.Book = Book;
})();
