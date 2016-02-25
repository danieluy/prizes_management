(function (){

	socket.on('resRenderMessage', function(_data){
		var info_message = document.getElementById('info_message');
		var info_error = document.getElementById('info_error');
		if(_data.error){
			info_error.children[1].innerHTML = _data.error;
			info_error.classList.remove('pos-bottom-out');
			info_error.classList.add('pos-bottom-in');
		}
		else if(_data.message){
			info_message.children[1].innerHTML = _data.message;
			info_message.classList.remove('pos-bottom-out');
			info_message.classList.add('pos-bottom-in');
			setTimeout(function(){
				info_message.children[1].innerHTML = '';
				info_message.classList.remove('pos-bottom-in');
				info_message.classList.add('pos-bottom-out');
			}, 3000)
		}
	});

}());
