# Animated JavaScript Heatmap on OpenStreetMap

This code is a fork of [NYTCommentsMap](https://github.com/alastaircoote/NYTCommentsMap) by [Alastair Coote](https://github.com/alastaircoote)!

### Used software

JavaScript libraries

* [jQuery](http://jquery.com) (v1.11.0)
* [RequireJS](http://requirejs.org/) (v2.1.11)
* [Leaflet](http://leafletjs.com/) (v0.7.2)
* [Heatmap.js](http://www.patrick-wied.at/static/heatmapjs/) (modified v1.0)

    The Heatmap.js is modified by Alastair Coot to improve the performance. Further informations you find in this blog article [Improving canvas performance – never underestimate copy and paste](http://blogging.alastair.is/improving-performance-never-underestimate-copy-and-paste/).

### Getting started

* Open the [mapdisplay.js](js/map/mapdisplay.js) and modify the parameters in the function ´MapDisplay´
* Create the file `js/data/sampleData.js` and insert your data:

```
var sampleData = { ... , "data":
[
    {"date":1306188000, "points":
        [
            {"lat":32.0,"lon":-16.5,"val":0.00056},
            {"lat":36.0,"lon":-14.5,"val":0.02756},
            ...
        ]
    },
    {"date":1306191600, "points":
        [
            {"lat":33.0,"lon":-17.5,"val":0.00236},
            {"lat":37.0,"lon":-15.5,"val":0.03156},
            ...
        ]
    },
    ...
]};
```
(The `data` array contains entries, which have a timestamp in seconds as `date` and an array named `points`. This neasted array contains all points for the spefic `date` and each entry has a location (latitude `lat` and longitude `lon`) and a value `val`.)