/*global test, module, ok, equal, expect */
(function () {
	'use strict';

	var TestApp = function () {
		var s = window.shiu,
			app = s.App;

		module('App');
		test('启动', function () {
			app.init();
			app.run();
			app.download();
			equal(typeof app, 'object');
		});

	};

	window.shiu.test.TestApp = TestApp;
}());
