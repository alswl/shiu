/*global test, module, ok, equal, expect */
(function () {
	'use strict';

	var TestApp = function () {
		var s = window.shiu,
			app;

		module('App');
		test('启动下载', function () {
			app = Object.create(s.App);
			window.shiu.DEBUG = true;
			window.shiu.DEBUG_MODE = 'normal';

			app.init();
			app.BOOK_DATA_URL = '../qingyunian1/book.js';
			app.BOOK_VERSION_URL = '../qingyunian1/version.js';
			app.download();
			equal(typeof app, 'object');
		});

	};

	window.shiu.test.TestApp = TestApp;
}());
