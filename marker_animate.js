(function(window, document, maps, undefined){
  /**
   * Animation functions from the request animation frame API.
   */
  var animate = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
  /**
   * Determines if animations are supported or not.
   * @constant
   */
  var animationsSupported = animate && cancel;
  /**
   * A dictionary of running animations.
   * [ Marker : MarkerAnimationContext ]
   */
  var animations = {};
  /**
   * Represents a context object for running animations.
   * @constructor
   * @param {Marker} marker - A Marker object from the Maps API.
   * @param {function} completion - A completion function to be invoked when the animation finishes.
   */
  function MarkerAnimationContext(marker, completion){
    this.canceled = false;
    this.complete = function(finished){
      if (animations[marker] == this) {
        delete animations[marker];
      }
      if (completion) {
        completion(finished);
      }
    };
    var current = animations[marker];
    if (current) {
      current.canceled = true;
    }
    animations[marker] = this;
  };
  /**
   * Animates a marker to a determined position.
   * @function
   * @param {Marker} marker - A Marker object from the Maps API represeting the marker to animate.
   * @param {LatLng} position - A LatLng object from the Maps API represeting the position to which the marker should be animated to.
   * @param {Dictionary} options - An options dictionary. Supported options are `easing` and `duration`.
   * @param {function} completion - A completion function to be invoked when the animation finishes.
   */
  function animateMarkerToPosition(marker, position, options, completion){
    var duration = (options.duration) || 1000;
    var easing = (options.easing === "linear") ? undefined : (options.easing || easeOutQuad);
    if (!animationsSupported || duration <= 0) {
      marker.setPosition(position);
      return;
    }
    // Create a new animation context.
    var ctx = new MarkerAnimationContext(marker, completion);
    // Prepare the positions.
    var startPositionLat = marker.getPosition().lat();
    var startPositionLng = marker.getPosition().lng();
    var finalPositionLat = position.lat();
    var finalPositionLng = position.lng();

    // If needs to go around the world.
    if (Math.abs(finalPositionLng - startPositionLng) > 180) {
      if (finalPositionLng > startPositionLng) {
        finalPositionLng -= 360;
      } else {
        finalPositionLng += 360;
      }
    }
    var startTime = (new Date()).getTime();
    var frame = function(){
      if (ctx.canceled) {
        ctx.complete(false);
        return;
      }
      var elapsedTime = (new Date()).getTime() - startTime;
      var durationRatio = elapsedTime / duration;
      var easingDurationRatio = durationRatio;

      if (easing) {
        easingDurationRatio = easing(durationRatio, elapsedTime, 0, 1, duration);
      }

      if (durationRatio < 1) {
        var deltaPosition = new google.maps.LatLng(startPositionLat + (finalPositionLat - startPositionLat) * easingDurationRatio, startPositionLng + (finalPositionLng - startPositionLng) * easingDurationRatio);
        marker.setPosition(deltaPosition);

        animate(frame);
      } else {
        marker.setPosition(position);
        ctx.complete(true);
      }
    };
    animate(frame);
  }
  /**
   * Quad easing function.
   * @function
   */
  function easeOutQuad(x, t, b, c, d) {
    return -c *(t/=d)*(t-2) + b;
  }
  /**
   * Extends the Maps API.
   * @function
   */
  function extend(){
    maps.Marker.prototype.setPositionAnimated = function(p, o, c){
      animateMarkerToPosition(this, p, o, c);
    }
  }
  extend();
})(window, document, google.maps);
