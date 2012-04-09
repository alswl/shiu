(function() {
 	var Db = {

		get: function(key) {
			try {
				return JSON.parse(window.localStorage.getItem(key));
			}
			catch(error) {
				return null;
			}
		},

		set: function(key, value) {
			window.localStorage.setItem(key, JSON.stringify(value));
		},
	}

	window.db = Db;
})();
