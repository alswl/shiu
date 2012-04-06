jQuery.extend({
	isIphone: function () {
		return (navigator.userAgent.match(/iPhone/i)) ||
		(navigator.userAgent.match(/iPod/i)) ||
		(navigator.userAgent.match(/iPad/i));
	},
});
