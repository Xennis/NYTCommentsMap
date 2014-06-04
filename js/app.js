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

	requirejs(["js/map/mapdisplay", "js/map/heatmap-layer", "js/map/heatmap-legend", "js/navigation-bar.js", "js/data/sampleData", "jquery"], function(MapDisplay, HeatMapLayer, HeatMapLegend, NavigationBar) {
		var setHeatData;
		var mapDisplay = new MapDisplay($("#map"));
		var heatmapLayer = new HeatMapLayer();
		var navigationBar = new NavigationBar(heatmapLayer);
		
		
		mapDisplay.map.addLayer(heatmapLayer);

/*	
		var heatMapLegend = new HeatMapLegend({
            title: 'Example Distribution',
            gradient: { 0.45: "rgb(0,0,255)", 0.55: "rgb(0,255,255)", 0.65: "rgb(0,255,0)", 0.95: "yellow", 1.0: "rgb(255,0,0)"}
        });
        document.body.appendChild(heatMapLegend.getElement());
*/
		setHeatData = function(data) {
			navigationBar.config(data.length);
			heatmapLayer.setData(data);
		};
		
		// Display time
		heatmapLayer.on("date_change", function(d) {
			navigationBar.update(d.index, d.date);
		});
	
		heatmapLayer.on("animation_done", function() {
			navigationBar.reset();
		});	
	
		setHeatData(zamgTestData1.data);
	});

}).call(this);