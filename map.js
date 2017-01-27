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
      origin: new google.maps.LatLng("-33.4228096", "-70.6089065"),
      destination: new google.maps.LatLng("-33.4228185", "-70.6055966"),
      waypoints: [{ location: new google.maps.LatLng("-33.4227335", "-70.607383")}],
      travelMode: google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: false
    };

    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);

    directionsService.route(request, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(result);
        var positions = _this.decode_polyline(result.routes[0].overview_polyline);
        _this.move_marker(positions, 0);
      } else {
        alert("Esta dirección no existe " + status);
      }
    });
  },
  move_marker: function(positions, index) {
    var _this = this;
    var marker = _this.markers[0];
    var size = positions.length;

    if (index == 0) {
      var marker = new google.maps.Marker({
        position: {lat: positions[0][0], lng: positions[0][1]},
        map: _this.map
      });
      _this.markers.push(marker);
    }

    if(index < size) {
      var distance = 1;

      if (index > 0){
        distance = Math.floor(_this.distance_between(positions[index - 1], positions[index]));
      }

      setTimeout(function(){
        var options = { duration: 1000, easing: 'linear' };
        marker.setPositionAnimated(new google.maps.LatLng(positions[index][0],positions[index][1]), options, function(finished){});
        index++;
        _this.move_marker(positions, index);
      }, 1000);
    }
  },
  decode_polyline: function(str, precision) {
    var index = 0,
    lat = 0,
    lng = 0,
    coordinates = [],
    shift = 0,
    result = 0,
    byte = null,
    latitude_change,
    longitude_change,
    factor = Math.pow(10, precision || 5);

    while (index < str.length) {
      byte = null;
      shift = 0;
      result = 0;

      do {
        byte = str.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

      shift = result = 0;

      do {
        byte = str.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

      lat += latitude_change;
      lng += longitude_change;

      coordinates.push([lat / factor, lng / factor]);
    }
    return coordinates;
  },
};
