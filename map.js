var BaseMap = {
  init: function() {
    var _this = this;
    _this.google_maps();
    _this.initialize();
  },
  google_maps: function(){
    this.mapOptions = {
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(document.getElementById("map"), this.mapOptions);
  },
};
