/**
 * Map display
 * 
 * @author Alastair Coote (http://github.com/alastaircoote),
 *		   Xennis (http://github.com/xennis)
 */
(function() {

	define(["jslib/leaflet", "./heatmap-layer"], function(leaflet, h) {
		var MapDisplay;
		return MapDisplay = (function() {

			function MapDisplay(target) {
				var sttileLayer, tileLayer,
					_this = this;
				this.mapEl = target;
				this.map = L.map(this.mapEl[0], {
					fadeAnimation: false,
					zoom: 4,
					center: [60.5, -8]
				});
				tileLayer = L.tileLayer('http://{s}.tiles.mapbox.com/v3/alastaircoote.map-n7irpmld/{z}/{x}/{y}.png', {
					maxZoom: 18
				});
				tileLayer.addTo(this.map);
				sttileLayer = L.tileLayer('http://{s}.tiles.mapbox.com/v3/alastaircoote.map-rjqv06av/{z}/{x}/{y}.png', {
					maxZoom: 18,
					zIndex: 100
				});
				sttileLayer.addTo(this.map);
				return;
			}

	/*		MapDisplay.prototype.adjustData = function(data) {
				return data.map(function(p) {
					return {
						lat: p.lat,
						lng: p.lng,
						val: p.val > 50 ? p.val - 50 : p.val + 50
					};
				});
			};*/

			return MapDisplay;

		})();
	});

}).call(this);
