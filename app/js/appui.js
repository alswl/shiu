(function() {
	var AppUi = {
		//类成员
		$content: $('#content'),
		CHAPTER_SELECTOR: '#content .chapter',
		$chapter: null, // 章 dom节点，修改后需要重新载入
		SCREEN_WIDTH: 314,
		SCREEN_PADDING: 8,
		SCREEN_COLUMN_GAP: 12,

        init: function (app) {
			var self = this;
			self.app = app;
			self.bindChapterClick();
		},

		// 浏览模式
		displayHeroUnit: function () {
			$('#hero_unit').show();
		},

		displayNoIphone: function () {
			$('#noiphone').show();
		},

		displayDownload: function() {
			$('#download').show();
		},

		displayStandalone: function() {
			$('#main').show();
			//$("body").bind('touchmove', function (e) { // 静止触摸反弹
				//e.preventDefault();
			//});
		},

		// 缓存事件绑定
		cacheOnProgress: function(e) {
			var percent = "";
			if (e && e.lengthComputable) {
				percent = Math.round(100 * e.loaded / e.total)
			} else {
				percent = Math.round(100 * (++progresscount / 8)) 
			}
			$("#download .percent").text(percent);
		},

		cacheOnCached: function(e) {
			$("#download .percent").text('100');
			$("#download .tip").text("下载完成");
			$("#download .complete").show()
		},

		cacheOnUpdate: function() {
			$("#download .percent").text('100');
			$("#download .tip").text("下载完成");
			$("#download .complete").show()
		},

		// 书籍内容页面单击事件
		bindChapterClick: function() {
			var self = this;
			self.$content.delegate('#content .chapter', 'click', function(e){
				var x = e.clientX;
				var y = e.clientY;
				self.app.nextPage();
			});
		},

		bindTouch: function() {
		},

		contentTouched: function() {
		},
	
		// 设定当前页面到指定页数
		setPage: function(page) {
			var self = this;
			var left = 0 - (page - 1) * (self.SCREEN_WIDTH + self.SCREEN_COLUMN_GAP);
			if ($.browser.webkit) { // firefox for develop
				//left = left + (page - 1) * self.SCREEN_PADDING * 2;
			}
			self.$chapter.css('left', left + 'px');
		},

		refreshChapterWidth: function() {
		},

		setChapter: function(html) {
			this.$content.html(html);
			this.$chapter = $(this.CHAPTER_SELECTOR);
		},
	};

	window.AppUi = AppUi;
})();

