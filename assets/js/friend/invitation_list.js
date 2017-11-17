$(function (){

  if( __n('#invitationListController') ) return;

  var InvitationModel = L.Model.Friend.extend({
    urlRoot: '/api/v1/invitation'
  });

  var InvitationCollection = L.Collection.Default.extend({
    url: '/api/v1/invitation'
  });

  var MaybeModel = L.Model.Friend.extend({
    urlRoot: '/api/v1/maybe'
  });

  var MaybeCollection = L.Collection.Default.extend({
    url: '/api/v1/maybe'
  });

  var InvitationView = L.View.FriendView.extend({
    tagName: 'div',
    className: 'item',
    template: Template.get('friend/invitation_item'),
    ui: {
      cancel: '.cancel-btn',
      confirm: '.confirm-btn',
    },
    events: {
      'click @ui.cancel': 'cancelBtn',
      'click @ui.confirm': 'confirmBtn',
    },

    confirmBtn: function (e){
      this.model.save( {_action: 'confirm', access_token: L.Auth.getToken()} );
    },

    cancelBtn: function (e){
      this.model.save( {_action: 'cancel', access_token: L.Auth.getToken()} );
    }
  });

  var InvitationCollectionView = L.CollectionView.FriendCollectionView.extend({
    tagName: 'div',
    className: 'ui divided items',
    childView: InvitationView,
    emptyView: Marionette.View.extend({
      template: _.template('<div> You have no invitations</div>')
    }),
  });

  var MaybeView = Marionette.View.extend({
    tagName: 'div',
    className: 'item',
    template: Template.get('maybe_item'),
    ui: {
      maybe: '.maybe-btn'
    },
    events: {
      'click @ui.maybe': 'maybeBtn'
    },
    maybeBtn: function (e){
      this.model.save({access_token: L.Auth.getToken()});
    }
  });

  var MaybeCollectionView = Marionette.CollectionView.extend({
    tagName: 'div',
    className: 'ui middle aligned divided list',
    childView: MaybeView,
    emptyView: Marionette.View.extend({template: _.template('<div> You have no friends</div>')}),
  });

  var AppMain = Marionette.Application.extend({

    initialize: function (options){
      this.friends = options.friends;
      this.maybe = options.maybe;

      this.listenTo(this.friends, 'sync', this.friendsList);
      this.listenTo(this.maybe, 'sync', this.maybeList);
    },
    friendsList: function (){
      var v = new InvitationCollectionView({collection: this.friends});
      $('#invitationList').html(v.render().el);
    },
    maybeList: function (){
      console.log(this.maybe.toJSON());
      var v = new MaybeCollectionView({collection: this.maybe});
      $('#maybeList').html(v.render().el);
    },
    onStart: function(){
      this.friends.fetch({reset: true, data: {page: 1, access_token: L.Auth.getToken()}});
      this.maybe.fetch({reset: true, data: {page: 1, access_token: L.Auth.getToken()}});
    }
  });

  var friends = new InvitationCollection();
  var maybe = new MaybeCollection();

  app.main = new AppMain({friends: friends, maybe: maybe});
  app.main.start();

});
