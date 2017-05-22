$(function(){
  if( __n('#profileController') ) return;

  var Profile  = L.Model.Default.extend({
    urlRoot: '/api/v1/profile/getBasicData'
  });

  var ProfileCardView = L.View.DefaultBasicView.extend({
    tagName: 'div',
    className: 'ui segment segment400',
    template: Template.get('profile/card/profile_card'),
  });

  var ProfilePresentationView = L.View.DefaultBasicView.extend({
    tagName: 'div',
    className: 'ui segment segment400',
    template: Template.get('profile/presentation'),
  });

  var ParentView = Marionette.View.extend({
    tagName: 'div',
    className: 'ui grid container first-margin-segment',
    template: Template.get('profile/section_profile'),
    regions: {
      profile: {el: '#segmentCard', replaceElement: true},
      presentation: {el: '#segmentPresentation', replaceElement: true}
    },
    initialize: function(opts){
      var card = new ProfileCardView(opts);
      var presentation = new ProfilePresentationView(opts);
      this.showChildView('profile', card );
      this.showChildView('presentation', presentation );
    }
  });

  var AppView = Marionette.Application.extend({
    region: { el:'#profileController',replaceElement:true},
    initialize: function(opts){
      this.profile = opts.profile;

      this.listenTo(this.profile, 'sync', this.printProfile);
    },
    onStart: function (){
      this.profile.fetch({data:{id: $('#__i').val()}});
    },
    printProfile: function(){
      console.log(this.profile.toJSON());
      var view = new ParentView({model: this.profile});
      this.showView( view );
    }
  });

  var profile = new Profile();

  app.main = new AppView({profile: profile});
  app.main.start();

});
