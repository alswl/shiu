if (!$.isIphone()) {
	$('#noiphone').show();
} else {
    if (!window.navigator.standalone) {
		$('#download').show();
		var appCache = window.applicationCache;
		appCache.ondownloading = function () {
			window.progresscount = 0
		};
        appCache.onprogress = function (e) {
            var percent = "";
            if (e && e.lengthComputable) {
                percent = Math.round(100 * e.loaded / e.total)
            } else {
                percent = Math.round(100 * (++progresscount / 8)) 
            }
			$("#download .percent").text(percent);
        };
        appCache.oncached = function (e) {
			$("#download .percent").text('100');
            $("#download .tip").text("下载完成");
            $("#download .complete").show()
        };
        appCache.onnoupdate = function () {
			$("#download .percent").text('100');
            $("#download .tip").text("下载完成");
            $("#download .complete").show()
        }
	}
	else {
	}
};
