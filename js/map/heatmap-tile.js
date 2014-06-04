/**
 * Heatmap tile
 * 
 * @author Alastair Coote (http://github.com/alastaircoote)
 */
(function() {
	var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

	define(["jslib/leaflet", "jslib/heatmap"], function(L, HeatMap) {
		var HeatMapTile;
		return HeatMapTile = (function() {

			/**
			 * HeatMapTile
			 * 
			 * @constructor
			 * @param {HeatMapLayer} layer Heatmap layer
			 * @param {HTMLCanvasElement} canvas Canvas
			 * @param {L.point} point Point
			 * @param {number} radius Radius of a single datapoint in the heatmap (measured in pixels)
			 * @param {numer|null} max Maximum value
			 * @return {void}
			 */
			function HeatMapTile(layer, canvas, point, radius, max) {
				this.layer = layer;
				this.canvas = canvas;
				this.radius = radius || 40;
				this.max = max || 1;
				this.clear = __bind(this.clear, this);
				this.setData = __bind(this.setData, this);
				this.roundData = __bind(this.roundData, this);
				this.draw = __bind(this.draw, this);
				this.createHeatmap = __bind(this.createHeatmap, this);
				this.calculateBounds = __bind(this.calculateBounds, this);
				this.xy = point.multiplyBy(this.layer.options.tileSize);
				this.calculateBounds(this.radius);
			}

			/**
			 * Calculates the bounds.
			 * 
			 * @param {number} radius Radius of a data point
			 * @return {array} Empty array
			 */
			HeatMapTile.prototype.calculateBounds = function(radius) {
				this.radius = radius;
				// South west
				var sw = this.xy.clone().subtract([this.radius * 2, 0]).add([0, (this.radius * 2) + this.layer.options.tileSize]);
				// North east
				var ne = this.xy.clone().add([(this.radius * 2) + this.layer.options.tileSize, 0]).subtract([0, this.radius * 2]);
				this.pixelBounds = new L.Bounds(sw, ne);
				this.tileBounds = new L.LatLngBounds(this.layer._map.unproject(sw), this.layer._map.unproject(ne));
				this.createHeatmap();
				return this.points = [];
			};

			/**
			 * Creates a heatmap.
			 * 
			 * @return {heatmap}
			 */
			HeatMapTile.prototype.createHeatmap = function() {
				return this.hm = heatmapFactory.create({
					element: this.canvas,
					radius: this.radius
				});
			};
			
			/**
			 * Draws
			 * 
			 * @return {function}
			 */
			HeatMapTile.prototype.draw = function() {
				var projected,
				_this = this;
				projected = this.points.map(function(p) {
					return {
						x: p.x - _this.xy.x,
						y: p.y - _this.xy.y,
						count: p.count
					};
				});
				return this.hm.store.setDataSet({
					max: _this.max,
					data: projected
				});
			};

/*
			HeatMapTile.prototype.roundData = function(data) {
			  var roundedPoints, toReturn,
				_this = this;
			  roundedPoints = {};
			  toReturn = [];
			  data.forEach(function(p) {
				var existing, newPoint;
				newPoint = {
				  x: Math.round(p.x / _this.radius) * _this.radius,
				  y: Math.round(p.y / _this.radius) * _this.radius,
				  count: p.count
				};
				existing = roundedPoints[newPoint.x + "/" + newPoint.y];
				if (existing) {
				  return existing.count += newPoint.count;
				} else {
				  roundedPoints[newPoint.x + "/" + newPoint.y] = newPoint;
				  return toReturn.push(newPoint);
				}
			  });
			  return toReturn;
			};
*/
/*
			HeatMapTile.prototype.setData = function() {
			  var start;
			  start = new Date().valueOf();
			  return this.hm.store.setDataSet({
				max: 21.7,
				data: this.filteredPoints
			  });
			};
*/

			HeatMapTile.prototype.clear = function() {
				return this.hm.clear();
			};

			return HeatMapTile;

		})();
	});

}).call(this);
