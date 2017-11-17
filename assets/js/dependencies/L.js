var L 				= L || {}
,		Template 	= {}
,		Lang 			= {}
,		debug 		= false
, 	app 			= app || {};

Lang = {
	get: function(){
		return 'en';
	}
}

var _debug = function (){
	if (debug) console.log(arguments);
}

Template = {
	get: function(name){
		var tpl = Lang.get()+'/'+name;
		try {
			var t = 'assets/templates/'+tpl+'.html';
			if( !JST[t] ) _debug('template:no found:', t);
			return JST[t];
		} catch (e) {
			_debug('template:no found:', tpl);
			return null;
		}

	}
};

var __n = function (el){
	if (!Backbone.$(el).length) return true;
	return false;
};


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

L.Auth = {

	getToken: function (){
		return L.Auth.getSession().access_token;
	},

	getSession: function (){
		if( !window.localStorage ) return null;

		var _auth = JSON.parse(window.localStorage.getItem('_auth'));

		var n = new Date();

		if(_auth && _auth.expires){
			if( n > _auth.expires ){
				L.Auth.destroySession();
				window.location.href = '/account/signin';
			}else{
				return _auth;
			}
		}

	},

	saveSession: function (s){
		if( !window.localStorage ) return null;
		window.localStorage.setItem('_auth', JSON.stringify(s));
	},

	destroySession: function (){
		if( !window.localStorage ) return null;
		window.localStorage.setItem('_auth', null);
	}

};

app.instances 													= {};

$(function(){
	$('.ui.pointing.dropdown.link.item').dropdown({ action: 'combo'});
});
