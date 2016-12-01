Vue.component('item', {
	props: ['t'],
	template: '<li>{{ t.comment_text }}</li>'
});

var vue = new Vue({
	el: '#list',
	data: {
		ts: []
	}
});

io.socket.get('/traduction', function (datas){
	console.log('datas', datas);
	vue.$data.ts = datas;
});

io.socket.on('traduction', function (msg){
	console.log('msg', msg);

	switch(msg.verb){
		case 'updated':

			var data = msg.data;
			var prev = msg.data;

			var datas = _.map(vue.$data.ts, function (t){
				console.log('t', t);
				if( _.eq( t, prev ) ) return data;

				return t;
			});

		break;
	}
});
