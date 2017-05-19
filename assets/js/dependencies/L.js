var L 				= L || {}
,		Template 	= {}
, 	app 			= app || {};

Template = {
	get: function(name){
		return JST['assets/templates/'+name+'.html'];
	}
};

L.Region = {};
L.Model = {};
L.Collection = {};
L.View = {};
L.CollectionView = {};
L.Event = {};
L.Function = {};
L.Behavior = {};

L.Model.Friend 													= Backbone.Model;
L.Collection.Friend 										= Backbone.Collection;

L.View.EmptyBasicView 									= Marionette.View.extend({template: '<div>No items</div>'});

L.View.FriendView 											= Marionette.View;
L.CollectionView.FriendCollectionView 	= Marionette.CollectionView;

app.instances 													= {};
