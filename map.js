var BaseMap = {
  init: function() {
    var _this = this;
    _this.google_maps();
    _this.initialize();
  },
  google_maps: function(){
    this.markers = [];
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
    var _this = this;
    var map = this.map;

    var request = {
      origin: new google.maps.LatLng("-33.50711", "-70.720932"),
      destination: new google.maps.LatLng("-33.508334", "-70.721624"),
      waypoints: [{ location: new google.maps.LatLng("-33.507209", "-70.721032")}],
      travelMode: google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: false
    };

    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);

    directionsService.route(request, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(result);
      } else {
        alert("Esta dirección no existe " + status);
      }
    });
  },
  timeout_position: function(index, limit) {
    var _this = this;
    var start = _this.markers[0].getPosition();
    var end = _this.markers[1].getPosition();

    if(index < limit) {
      setTimeout(function(){
        var new_position = new google.maps.geometry.spherical.computeOffset(start, 1, google.maps.geometry.spherical.computeHeading(start, end));
        _this.markers[0].setPosition(new_position);
        index++;
        _this.timeout_position(index, limit);
      }, 1000);
    }
  }
};
