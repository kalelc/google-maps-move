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
  initialize: function() {
    var map = this.map;
    var position1 = new google.maps.LatLng(-33.50694, -70.72127);
    var position2 = new google.maps.LatLng(-33.50684, -70.72111);
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(position1);
    bounds.extend(position2);
    map.fitBounds(bounds);
    var marker1 = new google.maps.Marker({
      position: position1,
      map: map,
      label: "Marker 1"
    });
    var marker2 = new google.maps.Marker({
      position: position2,
      map: map,
      label: "Marker 2"
    });
    var marker1meter = new google.maps.Marker({
      position: new google.maps.geometry.spherical.computeOffset(position1, 1, google.maps.geometry.spherical.computeHeading(position1, position2)),
      map: map,
      label: "new position"
    })
  }
};
