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
		var allowStart, heatDataLoaded, heatmapLayer, mapDisplay;
		mapDisplay = new MapDisplay($("#map"));
		allowStart = function() {
			$("button").html("Start");
			return $("button").prop("disabled", false);
		};
		heatDataLoaded = false;
		heatmapLayer = new HeatMapLayer();
	
		// Display time
		heatmapLayer.on("date_change", function(d) {
			var date = new Date(d.date);
			return $("h2").html(date.toLocaleString());
		});
	
		heatmapLayer.on("animation_done", function() {
			mapDisplay.map.removeLayer(heatmapLayer);
			$("#button_start").html("Start");
		});	
	
		heatmapLayer.setData(sampleData.data);
		$("#button_start").html("Start");
		$("#button_start").prop("disabled", false);
		heatDataLoaded = true;

		$("#button_start").click(function() {
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
		
		heatMapLegend = new HeatMapLegend({
            position: 'br',
            title: 'Example Distribution',
            gradient: { 0.45: "rgb(0,0,255)", 0.55: "rgb(0,255,255)", 0.65: "rgb(0,255,0)", 0.95: "yellow", 1.0: "rgb(255,0,0)"}
        });
        document.body.appendChild(heatMapLegend.getElement());
	});

}).call(this);