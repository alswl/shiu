$(function() {
	var DEBUG = false;
	//var DEBUG_MODE = 'normal'; // normal / standalone
	var DEBUG_MODE = 'standalone'; // normal / standalone
	if (DEBUG && DEBUG_MODE == 'standalone') {
		window.navigator.standalone = true;
	}
	if (DEBUG && !window.shiu.util.isIphone()) {
		var element = document.createElement("script");
		element.type = "text/javascript";
		element.src = '../js/phantom-limb.js';
		$('head')[0].appendChild(element);
	}
	window.shiu.DEBUG = DEBUG;
	window.shiu.DEBUG_MODE = DEBUG_MODE;

	shiu.App.init();
	shiu.App.run();
});
