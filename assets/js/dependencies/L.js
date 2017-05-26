var L 				= L || {}
,		Template 	= {}
,		Lang 			= {}
,		debug 		= true
, 	app 			= app || {};

Lang = {
	get: function(){
		return 'en';
	}
}

Template = {
	get: function(name){
		var tpl = Lang.get()+'/'+name;
		var t = 'assets/templates/'+tpl+'.html';
		if( !JST[t] ) console.log('template:no found:', t);
		console.log('template:', t);
		return JST[t];
	}
};

var __n = function (el){
	if (!Backbone.$(el).length) return true;
	return false;
};

var _debug = function (){
	if (debug) console.log(arguments);
}

L.Region = {};
L.Model = {};
L.Collection = {};
L.View = {};
L.CollectionView = {};
L.Event = {};
L.Function = {};
L.Behavior = {};


L.View.EmptyBasicView 									= Marionette.View.extend({
																						template: '<div>No items</div>'});

L.View.DefaultBasicView 								= Marionette.View.extend({
																						initialize: function (opts){
																							this.model = opts.model;
																						}
																					});

L.Model.Default 												= Backbone.Model;

L.Model.Friend 													= L.Model.Default;

L.Collection.Default 										= Backbone.Collection.extend({
	parse: function (resp){
		return resp.results;
	}
});

L.Collection.Friend 										= L.Collection.Default;

L.View.FriendView 											= Marionette.View;
L.CollectionView.FriendCollectionView 	= Marionette.CollectionView;

app.instances 													= {};

$(function(){
	$('.ui.pointing.dropdown.link.item').dropdown({ action: 'combo'});
});
