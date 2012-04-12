$(function() {
	var DEBUG = true;
	//var DEBUG_MODE = 'normal'; // normal / standalone
	var DEBUG_MODE = 'standalone'; // normal / standalone
	if (DEBUG && DEBUG_MODE == 'standalone') {
		window.navigator.standalone = true;
	}
	window.shiu.DEBUG = DEBUG;
	window.shiu.DEBUG_MODE = DEBUG_MODE;

	shiu.App.init();
	shiu.App.run();
});
