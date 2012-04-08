(function() {
	var App = {
		// constants
		ui: AppUi,
		currentPage: null,

		// constructor
        init: function () {
			var self = this;
			self.ui.init(self);
			self.currentPage = 1;
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
			if (!self.isIphone() && !DEBUG) {
				self.ui.displayHeroUnit();
				self.ui.displayNoIphone();
			} else {
				if (!window.navigator.standalone && DEBUG_MODE != 'standalone') {
					self.ui.displayHeroUnit();
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
					self.standalone();
				}
			};
		},

		// 启用 App 模式
		standalone: function() {
			var self = this;
			self.chapters = [];
			for (var i = 0; i < book.indexs.length; i++) {
				chapter = new Chapter().init(book.indexs[i], book.contents[i]);
				self.chapters.push(chapter);
			}
			self.ui.setChapter(self.chapters[0].get$());
		},

		// 下一页
		nextPage: function() {
			var self = this;
			self.currentPage += 1;
			self.ui.setPage(self.currentPage);
		},
	};

	window.App = App;
})();

