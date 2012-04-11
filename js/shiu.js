$(function() {
	var DEBUG = false;
	//var DEBUG_MODE = 'normal'; // normal / standalone
	var DEBUG_MODE = 'standalone'; // normal / standalone
	if (DEBUG && DEBUG_MODE == 'standalone') {
		window.navigator.standalone = true;
	}
	window.DEBUG = DEBUG;
	window.DEBUG_MODE = DEBUG_MODE;

	App.init();
	App.run();
});
