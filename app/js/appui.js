(function() {
	var AppUi = {
		//类成员
		$heroUnit: $('#hero_unit'),
		$content: $('#content'),
		$alert: $('#alert'),
		$temp: $('#temp'),
		CHAPTER_SELECTOR: '#content .chapter',
		$chapter: null, // 章 dom节点，修改后需要重新载入
		SCREEN_WIDTH: 320,
		SCREEN_PADDING: 8,
		SCREEN_COLUMN_GAP: 12,

        init: function (app) {
			var self = this;
			self.app = app;
		},

		// 浏览模式
		displayHeroUnit: function () {
			$('#hero_unit').show();
		},

		displayDownload: function() {
			$('#hero_unit .book_desc').css('height', '120px');
			$('#download').show();
		},

		displayStandalone: function() {
			var self = this;
			$("body").bind('touchmove', function (e) { // 静止触摸反弹
				e.preventDefault();
			});
			self.$heroUnit.one('click', function() {
				self.app.startRead();
				self.bindChapterClick();
			});
		},

		displayRead: function() {
			this.$heroUnit.hide();
			$('#main').show();
		},

		// 缓存事件绑定
		cacheOnProgress: function(e) {
			var self = this;
			var percent = "";
			if (e && e.lengthComputable) {
				percent = Math.round(100 * e.loaded / e.total)
			} else {
				percent = Math.round(100 * (++progresscount / 8)) 
			}
			$("#download .percent").text(percent);
		},

		cacheOnCached: function(e) {
			App.saveBook(book); // 这时的 this 是 window.localstorage
			$("#download .percent").text('100');
			$("#download .tip").text("下载完成");
			$("#download .complete").show();
			App.success('下载完成', true);
			App.downloadCallback();
		},

		cacheOnUpdate: function() {
			App.saveBook(book); // 这时的 this 是 window.localstorage
			$("#download .percent").text('100');
			$("#download .tip").text("下载完成");
			$("#download .complete").show();
			App.success('下载完成', true);
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
					App.ui.$alert.hide();
					App.ui.$alert.children().html('').removeClass();
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
				} else if (x > 220) {
					self.app.nextClick();
				}
			});
		},

		bindTouch: function() {
		},

		contentTouched: function() {
		},
	
		// 设定当前页面到指定页数
		setPage: function(page) {
			var self = this;
			var left = 0 - page * (self.SCREEN_WIDTH + self.SCREEN_COLUMN_GAP);
			if ($.browser.webkit) { // firefox for develop
				//left = left + (page - 1) * self.SCREEN_PADDING * 2;
			}
			//self.$chapter.css('left', left + 'px'); 效率低
			self.$chapter.css('-webkit-transform','translate3d(' + left + 'px, 0, 0)'); // 硬件加速
			self.$chapter.css('-moz-transform','translate3d(' + left + 'px, 0, 0)');

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
			return ($('.chapter *').last().offset().left - this.SCREEN_PADDING) / (this.SCREEN_WIDTH + this.SCREEN_COLUMN_GAP) + 1;
		}
	};

	window.AppUi = AppUi;
})();

