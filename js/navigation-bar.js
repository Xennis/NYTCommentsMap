(function() {
	
define(["js/map/heatmap-layer"], function(HeatMapLayer) {
var NavigationBar;
return NavigationBar = (function() {

	/**
	 * Naviagation bar
	 * 
	 * @constructor
	 * @return {void}
	 */
	function NavigationBar(animatedLayer) {	
		this.animatedLayer = animatedLayer;
		this.button_start = $("#button_start");
		this.button_pause = $("#button_pause");
		this.checkbox_loop = $("#checkbox_loop");
		this.select_visualization = $("#select_visualization");
		this.select_speed = $("#select_speed");
		this.input_date = $("#input_date");
		this.slider_date = $("#slider_date");
		this.select_data = $("#select_data");
		this._observeSemaphore = false;		// Prevent observe function get calls twice
		
		this.observe();
	}
	
	/**
	 * Configurates all elements.
	 * 
	 * @param {number} dataLength Length of the given data
	 * @return {void}
	 */
	NavigationBar.prototype.config = function(dataLength) {
		this.slider_date.attr('max', dataLength - 1);
	};
	
	/**
	 * Resets all elements (expect the checkbox) to intial state.
	 * 
	 * @return {void}
	 */
	NavigationBar.prototype.reset = function() {
		this.button_start.text("Start");
		this.button_pause.text("Pause");
		this.button_pause.prop("disabled", true);
		this.input_date.val("");
		this.slider_date.val(0);
	};
	
	/**
	 * Updates all elements.
	 * 
	 * @param {number} index Current index 
	 * @param {numer} date Current timestamp in milliseconds
	 * @return {void}
	 */
	NavigationBar.prototype.update = function(index, date) {
		this.slider_date.val(index);
		this.input_date.val(new Date(date).toLocaleString());
	};
	
	NavigationBar.prototype.animatedStarted = function() {
		this.button_start.text('Stop');
		this.button_pause.prop('disabled', false);
		this.button_pause.text('Resume');	
	};
	
	/**
	 * Observes all elements.
	 * 
	 * @return {void}
	 */
	NavigationBar.prototype.observe = function() {
		/*
		 * Prevent that the function gets called twice.
		 */
		if (this._observeSemaphore) {
			console.log('ERROR: Function was already called!');
			return;
		} else {
			this._observeSemaphore = true;
		}

		var _this = this;

		this.button_start.click(function() {
			if ($(this).text() === 'Start') {
				$(this).text('Stop');
				_this.button_pause.prop('disabled', false);				
				_this.animatedLayer.animate();
			} else {
				_this.animatedLayer.animationStop();
			}
		});
		
		this.button_pause.click(function() {
			if ($(this).text() === 'Pause') {
				$(this).text('Resume');
				_this.animatedLayer.animationPause();
			} else {
				$(this).text('Pause');
				_this.animatedLayer.animationResume();
			}
		});
		
		this.checkbox_loop.change(function() {
			_this.animatedLayer.animationLoop($(this).prop('checked'));
		});
		
		this.select_visualization.change(function() {
			_this.animatedStarted();
			_this.animatedLayer.animationPause();
			_this.animatedLayer.dataLayer.setVisualizationType($(this).val());
			_this.animatedLayer.showMoment();		
		});
		
		this.select_speed.change(function() {
			_this.animatedLayer.setSpeed($(this).val());
		});

		this.select_data.change(function() {
			_this.animatedLayer.animationStop();
			var val = $(this).val();
			if (val === 'seviriTestData1') {
				setData(seviriTestData1.data, options);
			} else if (val === 'zamgTestData1') {
				setData(zamgTestData1.data, options2);
			} else if (val === 'zamgTestData2') {
				setData(zamgTestData2.data, options);
			}
		});		
		
		this.slider_date.change(function() {
			_this.animatedStarted();
			_this.animatedLayer.animationPause();
			_this.animatedLayer.showMoment($(this).val());
		});
		
		this.slider_date.hover(
			function() {
				_this.input_date.addClass('hover');
			}, function() {
				_this.input_date.removeClass('hover');
			}
		);
	};
	
	return NavigationBar;
})();
});
}).call(this);	