// AppUi
(function() {
	var AppUi = {
		//类成员
		$heroUnit: $('#hero_unit'),
		$alert: $('#alert'),
		$temp: $('#temp'),
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
			var p = window.shiu.ui;
			$("body").bind('touchmove', function (e) { // 静止触摸反弹
				e.preventDefault();
			});
			self.sidebar = Object.create(p.Sidebar).init('#sidebar', self);
			self.indexBtn = Object.create(p.IndexBtn).init('#sidebar .index_btn', self);
			self.content = Object.create(window.shiu.ui.Content).init('#content', self);
			self.$heroUnit.one('click', function() {
				self.app.startRead();
				//self.content.bindScroll(); // 延迟绑定
			});
		},

		displayRead: function() {
			this.$heroUnit.hide();
			$('#main').show();
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

		setChapter: function(html) {
			this.content.setChapter(html);
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

// 侧边栏
(function() {
	var Sidebar = {

		init: function(selector, ui) {
			var self = this;
			self.$ = $(selector);
			self.ui = ui;
			self.$indexs = $('#indexs');
			self.initIndexs();
			self.bindTouchStart();
			self.bindAClick();
			return self;
		},

		initIndexs: function() {
			var self = this;
			self.ui.$temp.html(self.ui.app.book.getIndexsHtml());
			self.$indexs.append(self.ui.$temp.children());
		},

		// 目录滚动
		bindIndexsScroll: function() {
			this.iScroll = new iScroll('index_wrapper', {});
		},

		fadeX: function(x) {
			this.$.css('-webkit-transform','translate3d(' + x + 'px, 0, 0)');
			this.$.css('-moz-transform','translate3d(' + x + 'px, 0, 0)');
		},

		hide: function() { // TODO 设计成分状态隐藏
			this.fadeX(0);
			this.$.css('background', 'none');
		},

		show: function() {
			if (this.iScroll === undefined) {
				this.bindIndexsScroll(); // 延迟绑定
			}
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

// 目录菜单按钮
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
			// Mozilla 这时 left 会误判
			return this.ui.sidebar.$.offset().left >= -280;
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

		bindDragEnd: function() { // TODO 暂时不用
			var self = this;
			self.$.ondragend = function(e) {
				self.ui.sidebar.show();
			};
		},

	};

	window.shiu.ui.IndexBtn = IndexBtn;
})();

// 书籍内容模块 Content
(function() {
	var Content = {

		init: function(selector, ui) {
			var self = this;
			self.$ = $(selector);
			self.ui = ui;
			self.bindClick();
			return self;
		},

		bindClick: function() {
			var self= this;
			self.$.click(function(e){
				var x = e.clientX;
				var y = e.clientY;
				if (x < 100) {
					self.ui.app.preClick();
					self.ui.indexBtn.hide();
				} else if (x > 220) {
					self.ui.app.nextClick();
					self.ui.indexBtn.hide();
				} else {
					self.ui.indexBtn.toggle();
				}
			});
		},

		bindScroll: function() {
			var self = this;
			new iScroll(self.$[0].id);
		},

		setChapter: function(html) {
			var self = this;
			self.ui.$temp.html(html);
			self.$.children().remove();
			self.$.append(self.ui.$temp.children());
			self.ui.$chapter = $(self.ui.CHAPTER_SELECTOR);
		},

	};

	window.shiu.ui.Content = Content;
})();
