(function() {
 	var Db = {

		init: function prepareDatabase(ready, error) {
			return openDatabase('documents', '1.0', 'Offline document storage', 50*1024*1024, function (db) {
				db.changeVersion('', '1.0', function (t) {
					t.executeSql('CREATE TABLE book (title, content)');
				}, error);
			});
		},

		get: function(key) {
			try {
				return JSON.parse(window.localStorage.getItem(key));
			}
			catch(error) {
				return null;
			}
		},

		set: function(key, value) {
			try {
				window.localStorage.setItem(key, JSON.stringify(value));
			} catch (e) {
				//if (e === 'QUOTA_EXCEEDED_ERR') {
				//}
				alert('存储失败！');
				throw e;
			}
		},
	}

	window.db = Db;
})();
