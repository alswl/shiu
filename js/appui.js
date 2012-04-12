(function() {
	var AppUi = {
		//类成员
		$heroUnit: $('#hero_unit'),
		$content: $('#content'),
		$alert: $('#alert'),
		$temp: $('#temp'),
		$indexs: $('#indexs'),
		CHAPTER_SELECTOR: '#content .chapter',
		$chapter: null, // 章 dom节点，修改后需要重新载入
		SCREEN_WIDTH: 320,
		SCREEN_HEIGHT: 480,
		SCREEN_PADDING: 8,
		SCREEN_COLUMN_GAP: 12,

        init: function (app) {
			var self = this;
			self.app = app;
		},

		// 浏览模式
		displayHeroUnit: function () {
			this.$heroUnit.show();
		},

		displayDownload: function() {
			this.$heroUnit.find('.book_desc').css('height', '120px');
			$('#download').show();
		},

		displayStandalone: function() {
			var self = this;
			$("body").bind('touchmove', function (e) { // 静止触摸反弹
				e.preventDefault();
			});
			self.$heroUnit.one('click', function() {
				self.app.startRead();
				self.initIndexs();
				self.bindChapterClick();
				self.sidebar = window.shiu.ui.Sidebar.init('#sidebar', self);
				self.indexBtn = window.shiu.ui.IndexBtn.init('#sidebar .index_btn', self);
			});
		},

		displayRead: function() {
			this.$heroUnit.hide();
			$('#main').show();
		},

		initIndexs: function() {
			var self = this;
			self.$indexs.html(self.app.book.getIndexsHtml());
			self.bindIndexsScroll();
		},

		// 设定横屏 / 适应尺寸 // TODO
		setScreen: function() {
			var x = window.screen.width;
			var y = window.screen.height;
			$('#body').css('width', x + 'px');
			$('#main').css('width', x + 'px');
			$('#index').css('width', x + 'px');
			$('#content .chapter').css('width', x + 'px');
			$('#content .chapter').css('-moz-column-width', x + 'px');
			$('#content .chapter').css('-webkit-column-width', x + 'px');
			$('#body').css('height', y + 'px');
			$('#main').css('height', y + 'px');
			$('#index').css('height', y + 'px');
			$('#content').css('height', y + 'px');
			this.SCREEN_WIDTH = x;
			this.SCREEN_HEIGHT = y;
			this.setPage(0);
		},

		// 更新下载百分比
		updateDownloadPercent: function(percent) {
			$("#download .percent").text(percent);
		},

		// 下载完成
		updateDownloadComplete: function() {
			this.updateDownloadPercent(100);
			$("#download .tip").text("下载完成");
			$("#download .complete").show();
		},

		alert: function(message, level, delay) {
			var self = this;
			if (level === 'disable') {
				self.$alert.hide();
				self.$alert.children().html('').removeClass();
				return;
			}
			self.$alert.show();
			self.$alert.children().html(message).addClass(level);
			if (delay === undefined) {
				$('body').one('click', function() {
					self.$alert.hide();
					self.$alert.children().html('').removeClass();
				});
			} else {
				setTimeout(function() {
					self.$alert.hide();
					self.$alert.children().html('').removeClass();
					}, 3000
				);
			}
		},

		// 书籍内容页面单击事件
		bindChapterClick: function() {
			var self = this;
			self.$content.click(function(e){
				var x = e.clientX;
				var y = e.clientY;
				if (x < 100) {
					self.app.preClick();
					self.indexBtn.hide();
				} else if (x > 220) {
					self.app.nextClick();
					self.indexBtn.hide();
				} else {
					self.indexBtn.toggle();
				}
			});
		},

		// 目录滚动
		bindIndexsScroll: function() {
			new iScroll('index_wrapper', {});
		},
	
		// 设定当前页面到指定页数
		setPage: function(page) {
			var self = this;
			var left = 0 - page * (self.SCREEN_WIDTH + self.SCREEN_COLUMN_GAP);
			if ($.browser.webkit) { // firefox for develop
				//left = left + (page - 1) * self.SCREEN_PADDING * 2;
			}
			//self.$chapter.css('left', left + 'px'); 效率低
			self.$chapter.css('-webkit-transform','translate3d(' +
				left + 'px, 0, 0)'); // 硬件加速
			self.$chapter.css('-moz-transform','translate3d(' +
				left + 'px, 0, 0)');

		},

		setChapter: function(html) {
			this.$temp.html(html);
			this.$content.children().remove();
			this.$content.append(this.$temp.children());
			//this.$content.children().first().remove();
			this.$chapter = $(this.CHAPTER_SELECTOR);
		},

		// 获取章节总页码
		getPageCount: function() {
			return ($('.chapter *').last().offset().left -
				this.SCREEN_PADDING) / (
					this.SCREEN_WIDTH + this.SCREEN_COLUMN_GAP
				) + 1;
		}
	};

	window.shiu.ui.AppUi = AppUi;
})();

(function() {
	var Sidebar = {

		init: function(selector, ui) {
			var self = this;
			self.$ = $(selector);
			self.ui = ui;
			self.bindTouchStart();
			self.bindAClick();
			return self;
		},

		fadeX: function(x) {
			this.$.css('-webkit-transform','translate3d(' + x + 'px, 0, 0)');
			this.$.css('-moz-transform','translate3d(' + x + ', 0, 0)');
		},

		hide: function() { // TODO 设计成分状态隐藏
			this.fadeX(0);
			this.$.css('background', 'none');
		},

		show: function() {
			this.fadeX(320);
			this.$.css('background', 'transparent');
		},

		isVisiable: function() {
			return this.$.offset().left >= 0;
		},

		toggle: function() {
			if (this.isVisiable()) {
				this.hide();
			} else {
				this.show();
			}
		},

		bindTouchStart: function() {
			var self = this;
			self.$.bind('touchstart', function(e) {
				if (e.touches[0].clientX - self.$.offset().left > 280) {
					self.hide();
					return false;
				}
			});
		},

		bindAClick: function() {
			var self = this;
			self.$.find('#indexs li a').click(function(e) {
				self.ui.app.book.setCurrentChapterIndex(parseInt(this.rel, 10));
				self.ui.app.setChapter();
				self.hide();
				}
			);
		},

	};

	window.shiu.ui.Sidebar = Sidebar;
})();

(function() {
	var IndexBtn = {

		init: function(selector, ui) {
			var self = this;
			self.$ = $(selector);
			self.ui = ui;
			self.bindTouchStart();
			return self;
		},

		hide: function() {
			this.ui.sidebar.hide();
		},

		show: function() {
			this.ui.sidebar.fadeX(40);
		},

		isVisiable: function() {
			return this.$.offset().left >= 0;
		},

		toggle: function() {
			if (this.isVisiable()){
				this.hide();
			} else {
				this.show();
			}
		},

		bindTouchStart: function() {
			var self = this;
			self.$.bind('touchstart', function(e) {
				self.ui.sidebar.toggle();
				e.stopPropagation();
				return false;
			});
		},

		bindDragEnd: function() { // TODO 用 iScroll 实现拖拽
			var self = this;
			self.$.ondragend = function(e) {
				self.ui.sidebar.show();
			};
		},

	};

	window.shiu.ui.IndexBtn = IndexBtn;
})();
