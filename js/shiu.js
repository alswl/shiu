$(function () {
	'use strict';

	var DEBUG = false,
		//DEBUG_MODE = 'normal', // normal / standalone
		DEBUG_MODE = 'standalone', // normal / standalone
		element;
	if (DEBUG && DEBUG_MODE === 'standalone') {
		window.navigator.standalone = true;
	}
	if (DEBUG && !window.shiu.util.isIphone()) {
		element = document.createElement("script");
		element.type = "text/javascript";
		element.src = '../js/phantom-limb.js';
		$('head')[0].appendChild(element);
	}
	window.shiu.DEBUG = DEBUG;
	window.shiu.DEBUG_MODE = DEBUG_MODE;

	window.shiu.App.init();
	window.shiu.App.run();
});
