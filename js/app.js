/* global bookTitle */
(function () {
	'use strict';
	var App = {
		// constants
		UPDATE_FREQUENCY: 7, // 更新书籍数据频率

		// constructor
        init: function () {
			var self = this;
			self.ui = Object.create(window.shiu.ui.AppUi);
			self.ui.init(self);
			self.db = window.shiu.db.Db;
			self.bindOrientate();
		},

		// 启动应用
		run: function () {
			var self = this, book;
			self.ui.displayHeroUnit();
			if (!window.shiu.util.isMobile() && !window.shiu.DEBUG) { // 非 iOS 打开
				self.error('请在iPhone/iPod Touch打开');
			} else {
				// 以独立应用打开
				if (window.navigator.standalone || window.shiu.util.isAndroid() ||
						(window.shiu.DEBUG === true && window.shiu.DEBUG_MODE === 'standalone')) {
					if (!self.loadBook()) { // 书籍不存在
						self.error('书籍数据不存在，开始重新下载');
						self.downloadCallback = function () {
							window.location.reload();
						};
						self.download();
					} else {
						// 检查更新
						if (self.isNeedFetch()) {
							self.checkUpdate();
						}

						self.info('请单击开始阅读', true);
						self.book = window.shiu.model.Book.init(self.loadBook());
						self.ui.displayStandalone();
					}
				} else { // 页面打开，开始下载
					self.download();
				}
			}
		},

		downloadCallback: function () {
		},

		download: function () {
			var self = this,
				appCache = window.applicationCache,
				progressCount,
				onCached;
			self.ui.displayDownload();
			appCache.ondownloading = function () {
				progressCount = 0;
			};
			appCache.onprogress = function (e) {
				var percent = "";
				if (e && e.lengthComputable) {
					percent = Math.round(100 * e.loaded / e.total);
				} else {
					progressCount += 1;
					window.percent = Math.round(100 * (progressCount / 8));
				}
				self.ui.updateDownloadPercent(percent);
			};
			onCached = function (e) {
				self.success('下载完成', true);
				self.saveBook(window.book); // 这时的 this 是 window.localstorage
				self.ui.updateDownloadComplete();
				self.downloadCallback();
				self.db.set('book_version', window.shiu.bookVersion);
				self.setNextFetchDate();
			};
			appCache.oncached  = onCached;
			appCache.onnoupdate  = onCached;
			appCache.onupdateready = onCached;

			self.loadBookJs();
		},

		// 开始阅读
		startRead: function () {
			var self = this;
			self.ui.displayRead();
			self.ui.setChapter(self.book.getCurrentChapter().get$());
			self.ui.setPage(self.book.getCurrentPage());
			if (self.book.getCurrentPage() === 0) {
				self.book.setPageCount(self.ui.getPageCount());
			}
		},

		saveBook: function (book) {
			this.db.set(window.bookTitle  + '_book', book);
		},
		loadBook: function () {
			return this.db.get(window.bookTitle  + '_book');
		},

		// 绑定横屏
		bindOrientate: function () {
			var self = this, isOrientation = false;
			window.addEventListener("orientationchange", function (e) {
				if (Math.abs(window.orientation) !== 0) {
					//isOrientation = true;
					self.error('人家还不会横屏处理啦，等以后的版本吧', true);
				}
			}, false);
		},

		// 换页
		prePage: function () {
			var self = this;
			if (self.book.getCurrentPage() > 0) {
				self.book.setCurrentPage(self.book.getCurrentPage() - 1);
				self.ui.setPage(self.book.getCurrentPage());
			} else if (self.book.getCurrentChapterIndex() > 0) {
				self.preChapter();
			} else {
				return false;
			}
			return true;
		},
		nextPage: function () {
			var self = this;
			if (self.book.getCurrentPage() < self.book.getPageCount() - 1) {
				self.book.setCurrentPage(self.book.getCurrentPage() + 1);
				self.ui.setPage(self.book.getCurrentPage());
			} else if (self.book.getCurrentChapterIndex() < self.book.chapters.length - 1) {
				self.nextChapter();
			} else {
				return false;
			}
			return true;
		},

		// 换章
		preChapter: function () {
			var self = this;
			self.book.setCurrentChapterIndex(self.book.getCurrentChapterIndex() - 1);
			self.setChapter();
		},
		nextChapter: function () {
			var self = this;
			self.book.setCurrentChapterIndex(self.book.getCurrentChapterIndex() + 1);
			self.setChapter();
		},
		setChapter: function () {
			var self = this;
			self.book.setCurrentPage(0);
			self.ui.setChapter(self.book.getCurrentChapter().get$());
			self.book.setPageCount(self.ui.getPageCount());
			self.ui.setPage(0);
		},

		// alert
		error: function (message, delay) {
			this.ui.alert(message, 'error', delay);
		},
		info: function (message, delay) {
			this.ui.alert(message, 'info', delay);
		},
		success: function (message, delay) {
			this.ui.alert(message, 'success', delay);
		},
		messageDisable: function () {
			this.ui.alert(null, 'disable');
		},

		loadJs: function (url, callback) {
			var element = document.createElement('script');
			element.type = "text/javascript";
			element.src = url;
			$('head')[0].appendChild(element);
			if (callback !== undefined) {
				element.onload = callback;
			}
		},
		loadBookJs: function () {
			this.loadJs('./book.min.js');
			this.loadJs('./version.js');
		},

		bindUpdate: function () {
			var self = this;
			self.loadJs('./version.js', function () {
				if (window.shiu.bookVersion > self.db.get('book_version')) {
					if (window.confirm('有最新版本书籍数据更新')) {
						self.ui.displayHeroUnit();
						self.downloadCallback = function () {
							window.location.reload();
						};
						self.download();
					} else {
						self.info(
							'将在' + self.UPDATE_FREQUENCY + '天之后提醒您更新'
						);
						self.setNextFetchDate();
					}
				}
			});
		},
		isNeedFetch: function () {
			var now = new Date();
			return now.getTime() > this.getNextFetchDate();
		},
		checkUpdate: function (book) {
			var self = this;
			self.bindUpdate();
		},
		// 设定下次升级时间
		setNextFetchDate: function () {
			var self = this,
				time = new Date();
			time.setDate(time.getDate() + self.UPDATE_FREQUENCY);
			self.db.set('next_fetch_time', time.getTime());
		},
		getNextFetchDate: function () {
			var self = this;
			return self.db.get('next_fetch_time');
		}

	};

	window.shiu.App = App;
}());

