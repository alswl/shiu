/*global test, module, ok, equal, expect, book */
(function () {
	'use strict';

	var TestBook = function () {
		var s = window.shiu,
			bookJson = window.book,
			book;

		module('Chapter');
		book = s.model.Book.init(bookJson);

		test('测试 Book 本地存储', function () {
			ok(book.getCurrentPage() !== undefined);
			book.setCurrentPage(100);
			equal(book.getCurrentPage(), 100);

			book.setPageCount(200);
			equal(book.getPageCount(), 200);

			equal(book.getCurrentChapterIndex(), 0);
			book.setCurrentChapterIndex(10);
			equal(book.getCurrentChapterIndex(), 10);
			book.setCurrentChapterIndex(50);
			equal(book.getCurrentChapterIndex(), 0); // 最多只有 40 章
		});

		test('获取章节', function () {
			equal(typeof book.getCurrentChapter(), 'object');
		});
		test('获取目录', function () {
			var indexHtml = '<li><a href="javascript:;" rel="0">第一章楔子 一块黑布</a></li><li><a href="javascript:;" rel="1">第二章故事会</a></li><li><a href="javascript:;" rel="2">第三章无名黄书</a></li><li><a href="javascript:;" rel="3">第四章练功与读书</a></li><li><a href="javascript:;" rel="4">第五章深夜来客</a></li><li><a href="javascript:;" rel="5">第六章闷枕</a></li><li><a href="javascript:;" rel="6">第七章来者是客</a></li><li><a href="javascript:;" rel="7">第八章坟场</a></li><li><a href="javascript:;" rel="8">第九章年龄不是问题</a></li><li><a href="javascript:;" rel="9">第十章不耻而问</a></li><li><a href="javascript:;" rel="10">第十一章第五宗师？</a></li><li><a href="javascript:;" rel="11">第十二章霸道之气</a></li><li><a href="javascript:;" rel="12">第十三章简单粗暴的解释</a></li><li><a href="javascript:;" rel="13">第十四章谁是贩盐的老辛？</a></li><li><a href="javascript:;" rel="14">第十五章暂别费介</a></li><li><a href="javascript:;" rel="15">第十六章京都来信</a></li><li><a href="javascript:;" rel="16">第十七章我把菜刀献给你</a></li><li><a href="javascript:;" rel="17">第十八章血泪的继续</a></li><li><a href="javascript:;" rel="18">第十九章脸面问题</a></li><li><a href="javascript:;" rel="19">第二十章站在高岗上</a></li><li><a href="javascript:;" rel="20">第二十一章痛</a></li><li><a href="javascript:;" rel="21">第二十二章骚客</a></li><li><a href="javascript:;" rel="22">第二十三章猫扣子</a></li><li><a href="javascript:;" rel="23">第二十四章刺客</a></li><li><a href="javascript:;" rel="24">第二十五章豆腐如玉</a></li><li><a href="javascript:;" rel="25">第二十六章盖羊毛毯的老人</a></li><li><a href="javascript:;" rel="26">第二十七章监察院</a></li><li><a href="javascript:;" rel="27">第二十八章红袖添香夜抄书</a></li><li><a href="javascript:;" rel="28">第二十九章书贼</a></li><li><a href="javascript:;" rel="29">第三十章往事</a></li><li><a href="javascript:;" rel="30">第三十一章有歌者来</a></li><li><a href="javascript:;" rel="31">第三十二章倾船</a></li><li><a href="javascript:;" rel="32">第三十三章闲年</a></li><li><a href="javascript:;" rel="33">第三十四章竹帅</a></li><li><a href="javascript:;" rel="34">第三十五章雨夜回忆</a></li><li><a href="javascript:;" rel="35">第三十六章庆历四年春</a></li><li><a href="javascript:;" rel="36">第三十七章去京都？</a></li><li><a href="javascript:;" rel="37">第三十八章前夜</a></li><li><a href="javascript:;" rel="38">第三十九章离开澹州</a></li><li><a href="javascript:;" rel="39">第四十章望京</a></li>';
			equal(book.getIndexsHtml(), indexHtml);
		});

	};

	window.shiu.test.TestBook = TestBook;
}());
