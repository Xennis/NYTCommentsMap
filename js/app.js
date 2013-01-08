// Generated by CoffeeScript 1.3.3
(function() {

  requirejs.config({
    baseUrl: "/NYTCommentsMap",
    shim: {
      "jslib/leaflet": {
        deps: ["jquery"],
        exports: "L"
      },
      "jslib/jsbezier": {
        exports: "jsBezier"
      },
      "jslib/heatmap-leaflet": {
        deps: ["jslib/leaflet", "jslib/heatmap"]
      }
    },
    paths: {
      "jquery": "jslib/jquery-1.8.0"
    }
  });

  requirejs(["js/map/mapdisplay", "js/data/comments", "js/map/heatmaplayer", "js/sidebar", "jquery"], function(MapDisplay, CommentData, HeatMapLayer, SideBar) {
    var allowStart, com, heatDataLoaded, heatmapLayer, mapDisplay, sideDataLoaded;
    mapDisplay = new MapDisplay($("#map"));
    com = new CommentData();
    allowStart = function() {
      $("button").html("Start");
      return $("button").prop("disabled", false);
    };
    heatDataLoaded = false;
    sideDataLoaded = false;
    heatmapLayer = new HeatMapLayer();
    heatmapLayer.on("datechange", function(d) {
      var date, day, hour, minutes, month, suffix;
      date = new Date(d.dateMoment);
      month = date.getMonth() + 1;
      day = date.getDate();
      hour = date.getHours();
      suffix = "am";
      if (hour > 12) {
        hour = hour - 12;
        suffix = "pm";
      }
      minutes = date.getMinutes();
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      return $("h2").html("" + month + "/" + day + " " + hour + ":" + minutes + suffix + " EST");
    });
    mapDisplay.map.addLayer(heatmapLayer);
    com.on("loaded", function() {
      heatmapLayer.setData(com.data);
      $("button").html("Start");
      $("button").prop("disabled", false);
      heatDataLoaded = true;
      if (sideDataLoaded) {
        return allowStart();
      }
    });
    return $("button").click(function() {
      $("button, p").remove();
      return heatmapLayer.animate();
    });
  });

}).call(this);
