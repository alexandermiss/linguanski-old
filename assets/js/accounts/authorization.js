$(function(){

  var Account = Backbone.Model.extend();

  var Accounts = Backbone.Collection.extend({
    model: Account,
    url: '/api/v1/accounts'
  });

  parse: function (resp){
    _.extend(this, _.omit(resp, 'results') );
    return _.pick(resp, 'results').results;
  }

  var AccountView = Marionette.View.extend({
    tagName: 'div',
    className: 'one column row',
    template: Template.get('account_template')
  });

  var AccountEmptyView = Marionette.View.extend({
    template: _.template('<div>No items</div>')
  });

  var AccountCollectionView = Marionette.CollectionView.extend({
    tagName: 'div',
    className: 'ui vertically grid container',
    collection: new Accounts(),
    childView: AccountView,
    emptyView: AccountEmptyView
  });

  var AppRoute = Marionette.AppRouter.extend({
    initialize: function (opts){
      this.collection = opts.collection
    },
    routes: {
      '/page/:id': 'pageNumber'
    },
    pageNumber: function (id){
      try{
				id = parseInt(id);
				this.collection.fetch({ reset: true, data: { page: id} });
			}catch(err){
				Backbone.history.navigate('/page/1', {triger: true});
			}
    }
  });



});
