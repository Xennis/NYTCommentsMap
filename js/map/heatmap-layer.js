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
//		HeatMapLayer.prototype.isPaused = false;

		/**
		 * Creates a HeatMapLayer.
		 * 
		 * @constructor
		 * @param {Array} options Not used
		 * @return {void}
		 */
		function HeatMapLayer(options) {
			this.setDataRaw = __bind(this.setDataRaw, this);
			this.showMoment = __bind(this.showMoment, this);
			this.animate = __bind(this.animate, this);
			this.animationStart = __bind(this.animationStart, this);			
			this.animationResume = __bind(this.animationResume, this);
			this.animationPause = __bind(this.animationPause, this);
			this.animationStop = __bind(this.animationStop, this);
			this.animationLoop = __bind(this.animationLoop, this);			
			this.setData = __bind(this.setData, this);
			this.adjustTilesAfterZoom = __bind(this.adjustTilesAfterZoom, this);
			this.setRadius = __bind(this.setRadius, this);
			this.resetTiles = __bind(this.resetTiles, this);
			this.tiles = [];
			this.isPaused = false;
			this.isLooped = false;
			this.momentIndex = 0;
		}

		/**
		 * Creates a HeatMapTile and adds it to the tiles array.
		 * 
		 * @override L.tileLayer.canvas.drawTile ??
		 * @param {HTMLCanvasElement} canvas
		 * @param {L.point} tilePoint
		 * @return {void}
		 */
		HeatMapLayer.prototype.drawTile = function(canvas, point) {
			var max = 0.378;
			this.tiles.push(new HeatMapTile(this, canvas, point, this.radius, max));
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
				_this.animationPause();
				var _ref = _this.tiles;
				for (var _i = 0, _len = _ref.length; _i < _len; _i++) {
					tile = _ref[_i];
					tile.hm.clear();
				}
				_this.resetTiles();
			});
			map.on("zoomend", this.showMoment);
			map.on("moveend", this.showMoment);
//			map.on("movestart", this.animationPause);
			this.setRadius(map);
//			map.on("click", function() {
//				if (_this.isPaused) {
//					return _this.animationResume();
//				} else {
//					return _this.animationPause();
//				}
//			});
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
		 * Sets the data.
		 * 
		 * @param {Object} data
		 * @return {void}
		 */
		HeatMapLayer.prototype.setData = function(data) {
			this.data = data;
		};
		
		/**
		 * Sets the speed of the animation.
		 * 
		 * @param {number} speed_fps Speed in frames per seconds
		 * @return {void}
		 */
		HeatMapLayer.prototype.setSpeed = function(speed_fps) {
			this.speed_fpms = 1000 / speed_fps;
		};		
		
		/**
		 * Shows a specific moment.
		 * 
		 * @param {number} index A index of the given data array.
		 * @return {void}
		 */		
		HeatMapLayer.prototype.showMoment = function(index) {		
			if (index >= 0) {
				this.momentIndex = index;
			}
			var toDraw = [];
			var dataEntry = this.data[this.momentIndex];
			var points = dataEntry.points;
			for(var j = 0; j < points.length; j++) {
				var d = points[j];
				toDraw.push({
					lat: d.lat,
					lng: d.lon,
					count: d.val * 30
				});
			}
			this.fire("date_change", {
				index: this.momentIndex,
				date: dataEntry.date * 1000
			});
			this.setDataRaw(toDraw);
		};

		/**
		 * Animates the given data set.
		 * 
		 * @return {function}
		 */
		HeatMapLayer.prototype.animate = function() {
			var _this = this;
			this.hasEverStarted = true;
		
			var doDraw = function() {
				if (_this.isPaused) {
					return;
				}

				_this.showMoment();
				_this.momentIndex++;
				if (_this.momentIndex >= _this.data.length) {
					if (_this.isLooped) {
						_this.momentIndex = 0;
					} else {
						_this.animationStop();
						return;
					}
				}
				
				return window.requestAnimFrame(function() {
					return doDraw();
				});
			};
			return window.requestAnimFrame(function() {
				return doDraw();
			});
		};

		/**
		 * Starts the animation.
		 * 
		 * @return {void}
		 */
		HeatMapLayer.prototype.animationStart = function() {
			var _debugStartTime = new Date().getTime();
			console.log("animation started at " + _debugStartTime);
			this.isPaused = false;
			this.momentIndex = 0;
			this.animate();
		};

		/**
		 * Pauses the animation.
		 * 
		 * @return {void}
		 */
		HeatMapLayer.prototype.animationPause = function() {
			this.isPaused = true;
		};

		/**
		 * Pauses the animation.
		 * 
		 * @return {void}
		 */	
		HeatMapLayer.prototype.animationResume = function() {
			console.log("resume");
			if (!this.hasEverStarted || !this.isPaused) {
				return console.log("resume: NO");
			}
			this.isPaused = false;
			this.animate();
		};
		
		/**
		 * Stops the animation.
		 * 
		 * @return {void}
		 */
		HeatMapLayer.prototype.animationStop = function() {
			var _debugEndTime = new Date().getTime();
			console.log("animation stoped at " + _debugEndTime);
			this.momentIndex = 0;
//			this.resetTiles();
			this.fire("animation_done", {});
		};

		/**
		 * Set animation to a endless loop.
		 * 
		 * @param {boolean} isLooped True to activate endless loop
		 * @return {void}
		 */	
		HeatMapLayer.prototype.animationLoop = function(isLooped) {
				this.isLooped = isLooped;
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
