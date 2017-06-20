
$(function(){
  if( __n('#user-content') ) return;

  var Account = Backbone.Model.extend({
    urlRoot: '/api/v1/account'
  });

  var Accounts = Backbone.Collection.extend({
    model: Account,
    url: '/api/v1/accounts',
    parse: function (resp){
      return resp.results;
    }
  });

  var AccountView = Marionette.View.extend({
    tagName: 'div',
    className: 'item',
    template: Template.get('account_template'),
    ui: {
      btnActionDeactivate : '.deactivate',
      btnActionActivate : '.activate',
    },
    events: {
      'click @ui.btnActionDeactivate' : 'deleteAction',
      'click @ui.btnActionActivate'   : 'deleteAction'
    },
    modelEvents: {
      'change:activated': 'rendered'
    },
    deleteAction: function(e){
      this.model.set({activated: !this.model.get('activated')}).save();
    },
    rendered: function (){
      console.log(this.model.get('activated'));
      this.render();
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
				this.collection.fetch({ reset: true });
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
      Backbone.history.start({root: 'admin/authorizations'});
      Backbone.history.navigate('!/page/1', {trigger: true});
    }
  });

  app = new MyApp();
  app.start();

});
