(function() {
	var App = {
		// constants

		// constructor
		ui: AppUi,

        init: function () {
			var self = this;
			self.chapters = [];
			for (var i = 0; i < book.indexs.length; i++) {
				chapter = new Chapter().init(book.indexs[i], book.contents[i]);
				self.chapters.push(chapter);
			}
		},
		run: function() {
		},
	};
	window.App = App;
})();

