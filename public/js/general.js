// (function (){
//
// 	socket.on('resRenderMessage', function(_data){
// 		var info_message = document.getElementById('info_message');
// 		var info_error = document.getElementById('info_error');
// 		if(_data.error){
// 			info_error.children[1].innerHTML = _data.error;
// 			info_error.classList.remove('pos-bottom-out');
// 			info_error.classList.add('pos-bottom-in');
// 		}
// 		else if(_data.message){
// 			info_message.children[1].innerHTML = _data.message;
// 			info_message.classList.remove('pos-bottom-out');
// 			info_message.classList.add('pos-bottom-in');
// 			setTimeout(function(){
// 				info_message.children[1].innerHTML = '';
// 				info_message.classList.remove('pos-bottom-in');
// 				info_message.classList.add('pos-bottom-out');
// 			}, 3000)
// 		}
// 	});
//
// }());

(function (){

	socket.on('resRenderMessage', function(_data){
		if(_data.error){
			infoHub.render('error', _data.error);
		}
		else if(_data.alert){
			infoHub.render('alert', _data.alert);
		}
		else if(_data.message){
			infoHub.render('message', _data.message);
		}
	});

}());

var infoHub = {
	info_message: null,
	info_alert: null,
	info_error: null,
	init: function(){
		this.domCache();
	},
	domCache: function(){
		this.info_message = document.getElementById('info_message');
		this.info_alert = document.getElementById('info_alert');
		this.info_error = document.getElementById('info_error');
	},
	render: function(type, info){
		if(type === 'message'){
			this.info_message.children[1].innerHTML = info;
			this.info_message.classList.remove('pos-bottom-out');
			this.info_message.classList.add('pos-bottom-in');
			setTimeout(function(){
				this.info_message.children[1].innerHTML = '';
				this.info_message.classList.remove('pos-bottom-in');
				this.info_message.classList.add('pos-bottom-out');
			}, 3000)
		}
		if(type === 'alert'){
			this.info_alert.children[1].innerHTML = info;
			this.info_alert.classList.remove('pos-bottom-out');
			this.info_alert.classList.add('pos-bottom-in');
			setTimeout(function(){
				this.info_alert.children[1].innerHTML = '';
				this.info_alert.classList.remove('pos-bottom-in');
				this.info_alert.classList.add('pos-bottom-out');
			}, 3000)
		}
		else if(type === 'error'){
			this.info_error.children[1].innerHTML = info;
			this.info_error.classList.remove('pos-bottom-out');
			this.info_error.classList.add('pos-bottom-in');
			setTimeout(function(){
				this.info_error.children[1].innerHTML = '';
				this.info_error.classList.remove('pos-bottom-in');
				this.info_error.classList.add('pos-bottom-out');
			}, 6000)
		}
	}
}
infoHub.init();
