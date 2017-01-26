function BaseMap(){
  this.options = {};
  this.markers = [];
  this.polylines = [];
  this.circles = [];
  this.distance = 0;
  this.options.div = options.div || "#map";
  this.options.zoom = options.zoom || 8;
  this.options.lat = options.lat || 0;
  this.options.lng = options.lng || 0;
  this.options.styles = options.styles || false;
  this.options.mapTypeControl = options.mapTypeControl || false;

  this.mapOptions = {
    zoom: this.options.zoom,
    center: new google.maps.LatLng(this.options.lat, this.options.lng),
    styles: this.options.styles,
    mapTypeControl: this.options.mapTypeControl
  };

  this.map = new google.maps.Map(getElementById(this.options.div), this.mapOptions);
}
