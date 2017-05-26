var FileUpload = {};

FileUpload = {

  showPreview: function (img, file){
    if( file && !file.files[0] ) return;
    var reader = new FileReader();

    reader.onload = function (e){
      img.onload = function (){
        $('.ui.small.modal').modal('refresh');
      }
      img.src = e.target.result;
    }

    reader.readAsDataURL(file.files[0]);
  }

};
