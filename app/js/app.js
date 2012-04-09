(function() {
	var App = {
		// constants
		ui: AppUi,
		book: null,

		// constructor
        init: function () {
			var self = this;
			self.ui.init(self);
			self.book = Book.init(book);
			delete(book);
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
				if (!window.navigator.standalone && DEBUG_MODE != 'standalone') {
					self.ui.displayDownload();
					var appCache = window.applicationCache;
					appCache.ondownloading = function () {
						window.progresscount = 0
					};
					appCache.onprogress = self.ui.cacheOnProgress;
					appCache.oncached  = self.ui.cacheOnCached;
					appCache.onnoupdate  = self.ui.cacheOnUpdate;
				}
				else { // 以独立应用打开
					self.ui.displayStandalone();
					//self.standalone();
				}
			};
		},

		// 开始阅读
		startRead: function() {
			var self = this;
			self.ui.displayRead();
			self.ui.setChapter(self.book.chapters[0].get$());
			self.book.setPageCount(self.ui.getPageCount());
		},

		// 上一页
		prePage: function() {
			var self = this;
			if (self.book.getCurrentPage() > 1) {
				self.book.setCurrentPage(self.book.getCurrentPage() - 1);
				self.ui.setPage(self.book.getCurrentPage());
			}
		},
		// 下一页
		nextPage: function() {
			var self = this;
			if (self.book.getCurrentPage() < self.book.getPageCount()) {
				self.book.setCurrentPage(self.book.getCurrentPage() + 1);
				self.ui.setPage(self.book.getCurrentPage());
			}
		},
	};

	window.App = App;
})();

