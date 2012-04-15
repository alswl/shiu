/*global test, module, ok, equal, expect */
(function () {
	'use strict';

	var TestChapter = function () {
		var s = window.shiu,
			chapter;

		module('Chapter');
		chapter = Object.create(s.model.Chapter).init('标题', '内容1\n内容2\r内容3', 2);
		test('测试章节转换', function () {
			equal(chapter.get$(), '<section class="chapter">\n' +
				'<h2>第三章 标题</h2>\n' +
				'<p>内容1\n' +
				'内容2</p>\n' +
				'<p>内容3</p>\n\n' +
				'</section>');
			equal(chapter.getCnIndex(), '第三章');
		});

	};

	window.shiu.test.TestChapter = TestChapter;
}());
