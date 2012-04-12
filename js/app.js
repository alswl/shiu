(function() {
	var App = {
		// constants
		ui: window.shiu.ui.AppUi,
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
			if (!self.isIphone() && !window.shiu.DEBUG) { // 非 iOS 打开
				self.error('请在iPhone/iPod Touch打开');
			} else {
				// 以独立应用打开
				if (window.navigator.standalone ||
					(window.shiu.DEBUG === true && window.shiu.DEBUG_MODE === 'standalone')) {
					if (!self.loadBook()) { // 书籍不存在
						self.error('书籍数据不存在，开始重新下载');
						self.downloadCallback = function() {
							window.location.reload();
						}
						self.download();
					} else { // 开始阅读
						self.info('请单击开始阅读', true);
						book = self.loadBook();
						self.book = window.shiu.model.Book.init(self.loadBook());
						delete(book);
						self.ui.displayStandalone();
						self.bindOrientate();
					}
				} else  { // 页面打开，开始下载
					self.download();
				}
			};
		},

		downloadCallback: function() {
		},

		download: function() {
			var self = this;
			self.ui.displayDownload();
			var appCache = window.applicationCache;
			appCache.ondownloading = function () {
				window.progresscount = 0;
			};
			appCache.onprogress = function(e) {
				var self = this;
				var percent = "";
				if (e && e.lengthComputable) {
					percent = Math.round(100 * e.loaded / e.total)
				} else {
					percent = Math.round(100 * (++progresscount / 8)) 
				}
				self.ui.updateDownloadPercent(percent);
			};
			var onCached = function(e) {
				self.success('下载完成', true);
				self.saveBook(window.book); // 这时的 this 是 window.localstorage
				self.ui.updateDownloadComplete();
				self.downloadCallback();
			};
			appCache.oncached  = onCached;
			appCache.onnoupdate  = onCached;
			appCache.onupdateready = onCached;

			self.loadBookJs();
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


		// 绑定横屏
		bindOrientate: function() {
			var self = this;
			window.addEventListener("orientationchange", function (e) {
				if (Math.abs(window.orientation) === 90) {
					self.error('人家还不会横屏处理啦，等以后的版本吧', true);
				} else {
				}
			}, false);
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
			self.setChapter();
		},
		nextChapter: function() {
			var self = this;
			self.book.setCurrentChapterIndex(self.book.getCurrentChapterIndex() + 1);
			self.setChapter();
		},

		setChapter: function() {
			var self = this;
			self.book.setCurrentPage(0);
			self.ui.setChapter(self.book.getCurrentChapter().get$());
			self.book.setPageCount(self.ui.getPageCount());
			self.ui.setPage(0);
		},

		// alert
		error: function(message, delay) {
			this.ui.alert(message, 'error', delay);
		},
		info: function(message, delay) {
			this.ui.alert(message, 'info', delay);
		},
		success: function(message, delay) {
			this.ui.alert(message, 'success', delay);
		},
		messageDisable: function() {
			this.ui.alert(null, 'disable');
		}
	};

	window.shiu.App = App;
})();

