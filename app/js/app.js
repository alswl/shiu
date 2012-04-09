(function() {
	var App = {
		// constants
		ui: AppUi,
		book: null,

		// constructor
        init: function () {
			var self = this;
			self.ui.init(self);
		},

		// 是否 iPhone
		isIphone: function () {
			return (navigator.userAgent.match(/iPhone/i)) ||
			(navigator.userAgent.match(/iPod/i)) ||
			(navigator.userAgent.match(/iPad/i));
		},

		// 启动应用
		run: function() {
			var self = this;
			self.ui.displayHeroUnit();
			if (!self.isIphone() && !DEBUG) {
				self.ui.displayNoIphone();
			} else {
				if (window.navigator.standalone || (DEBUG === true && DEBUG_MODE === 'standalone')) { // 以独立应用打开
					book = self.loadBook();
					if (book === null) {
						self.ui.displayDownload();
						return;
					}
					self.book = Book.init(self.loadBook());
					//delete(book);
					self.ui.displayStandalone();
					//self.standalone();
				} else  {
					self.ui.displayDownload();
					var appCache = window.applicationCache;
					appCache.ondownloading = function () {
						window.progresscount = 0
					};
					self.loadBookJs();
					appCache.onprogress = self.ui.cacheOnProgress;
					appCache.oncached  = self.ui.cacheOnCached;
					appCache.onnoupdate  = self.ui.cacheOnUpdate;
				}
			};
		},

		// 开始阅读
		startRead: function() {
			var self = this;
			self.ui.displayRead();
			self.ui.setChapter(self.book.getCurrentChapter().get$());
			self.ui.setPage(self.book.getCurrentPage());
			if (self.book.getCurrentPage() === 0) {
				self.book.setPageCount(self.ui.getPageCount());
			}
		},

		loadBookJs: function() {
			var element = document.createElement("script"); 
			element.type = "text/javascript";
			element.src = './book.js';
			$('head')[0].appendChild(element);
		},

		saveBook: function(book) {
			db.set(bookTitle  + '_book', book);
		},
		loadBook: function() {
			return db.get(bookTitle  + '_book');
		},

		// 换页
		preClick: function() {
			var self = this;
			if (self.book.getCurrentPage() > 0) {
				self.book.setCurrentPage(self.book.getCurrentPage() - 1);
				self.ui.setPage(self.book.getCurrentPage());
			} else if (self.book.getCurrentChapterIndex() > 0){
				self.preChapter();
			}
		},
		nextClick: function() {
			var self = this;
			if (self.book.getCurrentPage() < self.book.getPageCount() - 1) {
				self.book.setCurrentPage(self.book.getCurrentPage() + 1);
				self.ui.setPage(self.book.getCurrentPage());
			} else if (self.book.getCurrentChapterIndex() < self.book.chapters.length - 1){
				self.nextChapter();
			}
		},

		// 换章
		preChapter: function() {
			var self = this;
			self.book.setCurrentChapterIndex(self.book.getCurrentChapterIndex() - 1);
			self.setChapterBegin();
		},
		nextChapter: function() {
			var self = this;
			self.book.setCurrentChapterIndex(self.book.getCurrentChapterIndex() + 1);
			self.setChapterBegin();
		},
		setChapterBegin: function() {
			var self = this;
			self.book.setCurrentPage(0);
			self.ui.setChapter(self.book.getCurrentChapter().get$());
			self.book.setPageCount(self.ui.getPageCount());
			self.ui.setPage(0);
		},
	};

	window.App = App;
})();

