$(function(){
  if( __n('#profileController') ) return;

  var Profile  = L.Model.Default.extend({
    urlRoot: '/api/v1/profile/getFullProfile'
  });

  var ProfileCardView = L.View.DefaultBasicView.extend({
    tagName: 'div',
    className: 'ui segment segment400',
    template: Template.get('profile/card/profile_card'),
    ui:{
      form: '#fileinfo',
      btn: '#btn',
      file: '#file',
      image: '.dimmable.image',
      change_img: '.change-image'
    },
    events:{
      'click @ui.change_img': 'showModal'
    },
    onRender: function (){
      this.ui.image.dimmer({on: 'hover'});
    },
    showModal: function (){
      console.log('modal');
      $('.ui.small.modal').modal({
  		  transition: 'scale',
  		  closable: false,
  		  onDeny    : function(){
          $('#file').empty();
  		  },
  		  onApprove : function() {
          profileUpload(profile);
  		  },
  		  onShow    : function(){
          // $('#fileinfo').show();
          $('[description], [image-content]').hide();
          $('#fileinfo').show();
  		  },
  		}).modal('show');
    }
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
      var view = new ParentView({model: this.profile});
      this.showView( view );
    }
  });

  var profile = new Profile();

  app.main = new AppView({profile: profile});
  app.main.start();


  var profileUpload = function (model){
    var formElement = document.getElementById('fileinfo');


    var xhr = new XMLHttpRequest();
    var form = new FormData(formElement);

    // FileUpload.showPreview(img, input_file);

    $('[description], [image-content]').hide();

    xhr.open('PUT', '/api/v1/profile/getFullProfile/'+model.get('id'));

    xhr.upload.addEventListener('progress', function (d){
      console.log('progress', d.loaded);
      if( d.total === d.loaded ){
        console.log('total', d.total);
      }
    });

    xhr.onreadystatechange = function (){
      if( xhr.readyState == 4 ){
        if( xhr.status == 200 ){
          var json = (xhr.responseText ? JSON.parse(xhr.responseText) : {});
          _debug('JSON', json);
          var obj = model.get('user');
          obj.photo = json.secure_url;
          model.set('user', obj);
          console.log(model.toJSON());
          var img = document.getElementById('imageProfile')
          img.src = model.get('user').photo;
        }
      }
    };

    xhr.send( form );

  };

  $('#file').on('change', function (){
    var input_file = document.getElementById('file');
    var img = document.getElementById('preview');
    FileUpload.showPreview(img, input_file);
    $('[description], [image-content]').show();
    $('#fileinfo').hide();
    $('.ui.small.modal').modal('refresh');
  });

});
