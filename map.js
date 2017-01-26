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
  distance_between: function(waypoint1, waypoint2) {
    var rm = 6371 * 1000;
    var rad_per_deg = Math.PI / 180;
    var lat1 = waypoint1[0] * rad_per_deg;
    var lng1 = waypoint1[1] * rad_per_deg;
    var lat2 = waypoint2[0] * rad_per_deg;
    var lng2 = waypoint2[1] * rad_per_deg;
    var dlat = lat2 - lat1;
    var dlng = lng2 - lng1;
    var a = Math.pow((dlat/2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow((dlng/2), 2);
    var c = 2 * Math.asin(Math.sqrt(a));
    return rm * c;
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

    var distance = this.distance_between([position1.lat(),position1.lng()], [position2.lat(),position2.lng()]);
    var iterate = (Math.floor(distance);

    var new_position = new google.maps.geometry.spherical.computeOffset(position1, 1, google.maps.geometry.spherical.computeHeading(position1, position2));

    var marker1meter = new google.maps.Marker({
      position: new_position,
      map: map,
      label: "new position"
    });

  }
};
