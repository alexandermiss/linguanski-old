var app = {};

$(function(){

  var Account = Backbone.Model.extend();

  var Accounts = Backbone.Collection.extend({
    model: Account,
    url: '/api/v1/accounts',
    parse: function (resp){
      // _.extend(this, _.omit(resp, 'results') );
      return resp.results;
    }
  });

  var AccountView = Marionette.View.extend({
    tagName: 'div',
    className: 'item',
    template: Template.get('account_template'),
    ui: {
      actionBtn : '.button'
    }
  });

  var AccountEmptyView = Marionette.View.extend({
    template: _.template('<div>No items</div>')
  });

  var AccountCollectionView = Marionette.CollectionView.extend({
    tagName: 'div',
    className: 'ui middle aligned divided list',
    collection: new Accounts(),
    childView: AccountView,
    emptyView: AccountEmptyView
  });

  var AppRoute = Marionette.AppRouter.extend({
    initialize: function (opts){
      this.collection = opts.collection
    },
    routes: {
      '!/page/:id': 'pageNumber'
    },
    pageNumber: function (id){
      try{
				id = parseInt(id);
				this.collection.fetch({ reset: true, data: { page: id} });
			}catch(err){
				// Backbone.history.navigate('page/1', {trigger: true});
			}
    }
  });

  var MyApp = Marionette.Application.extend({
    region: '#user-content',
    onStart: function (){
      this.showView(new AccountCollectionView());
      var col = this.getView().collection;
      var appRoute = new AppRoute({collection: col});
      Backbone.history.start({root: 'accounts/authorizations'});
      Backbone.history.navigate('!/page/1', {trigger: true});
    }
  });

  if( Backbone.$('#user-content').length ){
    console.log('starting');
    app = new MyApp();
    app.start();
  }

});
