/**
 * Application
 * 
 * @author Alastair Coote (http://github.com/alastaircoote),
 *		   Xennis (http://github.com/xennis)
 */
(function() {

	requirejs.config({
		baseUrl: "./",
		shim: {
			"jslib/leaflet": {
				deps: ["jquery"],
				exports: "L"
			},
			"jslib/heatmap-leaflet": {
				deps: ["jslib/leaflet", "jslib/heatmap"]
			}
		},
		paths: {
			"jquery": "jslib/jquery"
		}
	});

	requirejs(["js/map/mapdisplay", "js/map/heatmap-layer", "js/map/heatmap-legend", "js/data/sampleData", "jquery"], function(MapDisplay, HeatMapLayer, HeatMapLegend) {
		var allowStart, resetElements, setHeatData, heatDataLoaded, heatmapLayer, heatMapLegend, mapDisplay;
		mapDisplay = new MapDisplay($("#map"));
		heatDataLoaded = false;
		heatmapLayer = new HeatMapLayer();
	
		heatMapLegend = new HeatMapLegend({
            title: 'Example Distribution',
            gradient: { 0.45: "rgb(0,0,255)", 0.55: "rgb(0,255,255)", 0.65: "rgb(0,255,0)", 0.95: "yellow", 1.0: "rgb(255,0,0)"}
        });
        document.body.appendChild(heatMapLegend.getElement());
	
		var button_start = $("#button_start"); 
		var slider_date = $("#slider_date");

		allowStart = function() {
			button_start.html("Start");
			button_start.prop("disabled", false);
			slider_date.prop("disabled", false);
		};
		
		resetElements = function() {
			mapDisplay.map.removeLayer(heatmapLayer);
			slider_date.val(0);
			button_start.html("Start");			
		};
		
		setHeatData = function(sampleData) {
			slider_date.attr('max', sampleData.data.length);
			heatmapLayer.setData(sampleData.data);
			heatDataLoaded = true;
		};
		
		// Display time
		heatmapLayer.on("date_change", function(d) {
			slider_date.val(Number(slider_date.val())+1);
			
			var date = new Date(d.date);
			return $("h2").html(date.toLocaleString());
		});
	
		heatmapLayer.on("animation_done", resetElements);	
	
		setHeatData(sampleData);
		allowStart();

		button_start.click(function() {
			if ($(this).text() === "Start") {
				mapDisplay.map.addLayer(heatmapLayer);
				$(this).html("Pause");
				return heatmapLayer.animate();
			} else if ($(this).text() === "Pause") {
				$(this).html("Resume");
				return heatmapLayer.pause();
			} else if ($(this).text() === "Resume") {
				$(this).html("Pause");
				return heatmapLayer.resume();
			}
		});
		
		slider_date.change(function() {
			heatmapLayer.pause();
			heatmapLayer.resume($(this).val());
		});
		
	});

}).call(this);