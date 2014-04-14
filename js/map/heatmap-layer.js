/**
 * Heatmap layer
 * 
 * @author Alastair Coote (http://github.com/alastaircoote),
 *		   Xennis (http://github.com/xennis)
 */
(function() {
	var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
		__hasProp = {}.hasOwnProperty,
		__extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	/**
	 * 
	 * @param {type} L
	 * @param {type} HeatMap
	 * @param {type} HeatMapTile
	 * @return {HeatMapLayer}
	 */
	define(["jslib/leaflet", "jslib/heatmap", "./heatmap-tile"], function(L, HeatMap, HeatMapTile) {
		var HeatMapLayer;
		
		window.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
			return window.setTimeout(callback, 1000 / 60);
		};
		
		return HeatMapLayer = (function(_super) {

		__extends(HeatMapLayer, _super);

		/**
		 * True, if animation is paused.
		 * 
		 * @type {boolean}
		 */
		HeatMapLayer.prototype.paused = false;

		/**
		 * Creates a HeatMapLayer.
		 * 
		 * @constructor
		 * @param {Array} options Not used
		 * @return {void}
		 */
		function HeatMapLayer(options) {
			this.setDataRaw = __bind(this.setDataRaw, this);
			this.animate = __bind(this.animate, this);
			this.resume = __bind(this.resume, this);
			this.pause = __bind(this.pause, this);
			this.stop = __bind(this.stop, this);
			this.setData = __bind(this.setData, this);
			this.adjustTilesAfterZoom = __bind(this.adjustTilesAfterZoom, this);
			this.setRadius = __bind(this.setRadius, this);
			this.resetTiles = __bind(this.resetTiles, this);
			this.tiles = [];
			this.stopAnimation = false;
			this.lowIndex = 0;
		}

		/**
		 * Creates a HeatMapTile and adds it to the tiles array.
		 * 
		 * @param {HTMLCanvasElement} canvas
		 * @param {L.point} point
		 * @return {void}
		 */
		HeatMapLayer.prototype.drawTile = function(canvas, point) {
			this.tiles.push(new HeatMapTile(this, canvas, point, 5, 2.17));
		};

		/**
		 * Clears the tiles array.
		 * 
		 * @return {Array} Empty array
		 */
		HeatMapLayer.prototype.resetTiles = function() {
			return this.tiles = [];
		};

		/**
		 * Catch and handle map events like zoom in / out.
		 * 
		 * @param {L.map} map
		 * @return {function}
		 */
		HeatMapLayer.prototype.onAdd = function(map) {
			var _this = this;
			map.on("zoomstart", function() {
				var tile;
				_this.pause();
				var _ref = _this.tiles;
				for (var _i = 0, _len = _ref.length; _i < _len; _i++) {
					tile = _ref[_i];
					tile.hm.clear();
				}
				return _this.resetTiles();
			});
			map.on("zoomend", this.resume);
			map.on("moveend", this.resume);
			map.on("movestart", this.pause);
			this.setRadius(map);
			map.on("click", function() {
				if (_this.paused) {
					return _this.resume();
				} else {
					return _this.pause();
				}
			});
			return HeatMapLayer.__super__.onAdd.call(this, map);
		};

		/**
		 * Sets the radius and returns it
		 * 
		 * @param {L.map} map
		 * @return {number}
		 */
		HeatMapLayer.prototype.setRadius = function(map) {
			return this.radius = 10;
		};

		/**
		 * Adjusts tiles after zoom: Reset parameters/data and redraw tiles.
		 * 
		 * @return {function}
		 */
		HeatMapLayer.prototype.adjustTilesAfterZoom = function() {
			this.setRadius(this._map);
			this.projectAndRoundPoints();
			this.setData(this.currentData);
			this.assignPointsToTiles();
			return this.redrawAllTiles();
		};

		/**
		 * Redraws the tiles.
		 * 
		 * @return {Array}
		 */
		HeatMapLayer.prototype.redrawAllTiles = function() {
			var tile;
			var _ref = this.tiles;
			var _results = [];
			for (var _i = 0, _len = _ref.length; _i < _len; _i++) {
				tile = _ref[_i];
				_results.push(tile.draw());
			}
			return _results;
		};

		/**
		 * Set and returns the data.
		 * 
		 * @param {type} data
		 * @return {array}
		 */
		HeatMapLayer.prototype.setData = function(data) {
			return this.data = data;
		};

		/**
		 * Pauses the animation.
		 * 
		 * @return {void}
		 */
		HeatMapLayer.prototype.pause = function() {
			console.log("pause");
			this.paused = true;
		};

		/**
		 * Resume the animation.
		 * 
		 * @param {number|null} Array index resuming point
		 * @return {function|undefined}
		 */
		HeatMapLayer.prototype.resume = function(index) {
			console.log("resume");
			if (!this.hasEverStarted || !this.paused) {
				return console.log("resume: NO");
			}
			if (index >= 0) {
				this.lowIndex = index;
			}
			this.paused = false;
			return this.animate();
		};
		
		/**
		 * Stops the animation.
		 * 
		 * @return {void}
		 */
		HeatMapLayer.prototype.stop = function() {
			this.lowIndex = 0;
			this.resetTiles();
			this.fire("animation_done", {});
		};

		/**
		 * Animates the given data set.
		 * 
		 * @return {function}
		 */
		HeatMapLayer.prototype.animate = function() {
			var doDraw, _this = this;
			this.hasEverStarted = true;
		
			/**
			 * 
			 */
			doDraw = function() {

				if (_this.paused) {
					return;
				}

				_this.lowIndex++;
				if (_this.lowIndex >= _this.data.length) {
					return _this.stop();
				}

				var toDraw = [];
				var points = _this.data[_this.lowIndex].points;
				for(var j = 0; j < points.length; j++) {
					var d = points[j];
					toDraw.push({
						lat: d.lat,
						lng: d.lon,
						count: d.val
					});
				}
				_this.fire("date_change", {
					date: _this.data[_this.lowIndex].date * 1000
				});
				_this.setDataRaw(toDraw);
				return window.requestAnimFrame(function() {
					return doDraw();
				});
			};
			return window.requestAnimFrame(function() {
				return doDraw();
			});
		};

		/**
		 * Sets the raw data and calls the function to redraw the tiles.
		 * 
		 * @param {type} data
		 * @return {function}
		 */
		HeatMapLayer.prototype.setDataRaw = function(data) {
			var _this = this;
			var _ref = this.tiles;
			var tile;
			// Clear all tile point
			for (var _i = 0; _i < _ref.length; _i++) {
				tile = _ref[_i];
				tile.points = [];
			}
			var projected = data.map(function(data) {
				var proj = _this._map.project([data.lat, data.lng]);
				return {
					x: proj.x,
					y: proj.y,
					count: data.count
				};
			});

			for (var _j = 0; _j < projected.length; _j++) {
				var point = projected[_j];
				for (var _k = 0; _k < _ref.length; _k++) {
					tile = _ref[_k];
					if (tile.pixelBounds.contains([point.x, point.y])) {
						tile.points.push(point);
					}
				}
			}
			return this.redrawAllTiles();
		};

		return HeatMapLayer;

		})(L.TileLayer.Canvas);
	});

}).call(this);
