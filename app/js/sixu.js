jQuery.extend({
	isIphone: function () {
		return (navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i));
	},
})
var app = {};

if ($.isIphone()) {
	$('#download').show();
} else {
	$('#noiphone').show();
}
