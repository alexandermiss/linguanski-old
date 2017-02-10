$(function (){
	var apptradview;

	var Traduction = Backbone.Model.extend({
		urlRoot: '/traduction'
	});

	var Traductions = Backbone.Collection.extend({
		model: Traduction,
		url: '/traduction',
		initialize: function (){
			this.fetch({reset:true});
		}
	});

	var traductions = new Traductions();

	var TraductionRowView = Marionette.View.extend({
		tagName: 'tr',
		template: Template.get('table_item')
	});

	var TableEmptyView = Marionette.View.extend({
		template: _.template('<tr colspan="2">No items</tr>')
	});

	var MyCollectionView = Marionette.CollectionView.extend({
		tagName: 'tbody',
		collection: new Traductions(),
		childView: TraductionRowView,
		emptyView: TableEmptyView
	});

	var TableView = Marionette.View.extend({
		tagName: 'table',
		className: 'ui celled table',
		template: Template.get('table_traduction'),
		regions: {
			body:{
				el: 'tbody', replaceElement: true
			}
		},
		onRender: function (){
			this.showChildView('body', new MyCollectionView());
		}
	});

	if ($('#content-traductions').length){
		apptradview = new TableView();
		apptradview.render();
		$('#content-traductions').html(apptradview.$el);
	}


	io.socket.on('traduction', function (msg){
		console.log('msg', msg);

		    switch (msg.method) {
		        case 'created': traductions.add(msg.data); break;
		        case 'updated': traductions.get(msg.id).set(msg.previous); break;
		        case 'destroyed': traductions.remove(traductions.get(msg.id)); break;
		    }

	});


	$('#add-traduction').on('click', function (e){
		$('#modal-traductions').modal({
		  transition: 'scale',
		  closable: false,
		  onDeny    : function(){
		    // return false;
		  },
		  onApprove : function() {
		    var $c = $('#comment'), comment = $c.val();
		    traductions.create({ comment_text: comment });
		    $c.val('');
		  },
		  onShow    : function(){
		  },
		}).modal('show');
	});

	$('.ui.dropdown').dropdown();

});
