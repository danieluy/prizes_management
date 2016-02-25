var url = document.getElementById('pageUrl').innerHTML;
var wan_url = document.getElementById('wan_pageUrl').innerHTML;
var socket = io.connect(url);
socket.on('connect', function() {
	if(!socket.connected) socket = io.connect(wan_url);
});
