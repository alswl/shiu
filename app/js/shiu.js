var DEBUG = false;
var DEBUG_MODE = 'standalone'; // normal / standalone
if (DEBUG && DEBUG_MODE == 'standalone') {
	window.navigator.standalone = true;
}

App.init();
App.run();
