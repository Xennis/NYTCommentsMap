/**
 * Heatmap legend
 * 
 * This code is originally part of heatmap.js:
 * 
 * heatmap.js 1.0 -    JavaScript Heatmap Library
 *
 * Copyright (c) 2011, Patrick Wied (http://www.patrick-wied.at)
 * Dual-licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and the Beerware (http://en.wikipedia.org/wiki/Beerware) license.
 */
(function() {

	define([], function() {
		var HeatMapLegend;
		return HeatMapLegend = (function() {

			function HeatMapLegend(config) {
				
				this.config = config;

				var _ = {
					element: null,
					labelsEl: null,
					gradientCfg: null,
					ctx: null
				};
				this.get = function(key){
					return _[key];
				};
				this.set = function(key, value){
					_[key] = value;
				};
				this.init();
				return;
			}

			HeatMapLegend.prototype = {
				init: function(){

					var me = this,
						config = me.config,
						title = config.title || "Legend",
						position = config.position,
						offset = config.offset || 10,
						gconfig = config.gradient,
						labelsEl = document.createElement("ul"),
						labelsHtml = "",
						grad, element, gradient, positionCss = "";

					me.processGradientObject();

					// Positioning

					// top or bottom
					if(position.indexOf('t') > -1){
						positionCss += 'top:'+offset+'px;';
					}else{
						positionCss += 'bottom:'+offset+'px;';
					}

					// left or right
					if(position.indexOf('l') > -1){
						positionCss += 'left:'+offset+'px;';
					}else{
						positionCss += 'right:'+offset+'px;';
					}

					element = document.createElement("div");
					element.style.cssText = "border-radius:5px;position:absolute;"+positionCss+"font-family:Helvetica; width:256px;z-index:10000000000; background:rgba(255,255,255,1);padding:10px;border:1px solid black;margin:0;";
					element.innerHTML = "<h3 style='padding:0;margin:0;text-align:center;font-size:16px;'>"+title+"</h3>";
					// create gradient in canvas
					labelsEl.style.cssText = "position:relative;font-size:12px;display:block;list-style:none;list-style-type:none;margin:0;height:15px;";


					// create gradient element
					gradient = document.createElement("div");
					gradient.style.cssText = ["position:relative;display:block;width:256px;height:15px;border-bottom:1px solid black; background-image:url(",me.createGradientImage(),");"].join("");

					element.appendChild(labelsEl);
					element.appendChild(gradient);

					me.set("element", element);
					me.set("labelsEl", labelsEl);

					me.update(1);
				},
				processGradientObject: function(){
					// create array and sort it
					var me = this,
						gradientConfig = this.config.gradient,
						gradientArr = [];

					for(var key in gradientConfig){
						if(gradientConfig.hasOwnProperty(key)){
							gradientArr.push({ stop: key, value: gradientConfig[key] });
						}
					}
					gradientArr.sort(function(a, b){
						return (a.stop - b.stop);
					});
					gradientArr.unshift({ stop: 0, value: 'rgba(0,0,0,0)' });

					me.set("gradientArr", gradientArr);
				},
				createGradientImage: function(){
					var me = this,
						gradArr = me.get("gradientArr"),
						length = gradArr.length,
						canvas = document.createElement("canvas"),
						ctx = canvas.getContext("2d"),
						grad;
					// the gradient in the legend including the ticks will be 256x15px
					canvas.width = "256";
					canvas.height = "15";

					grad = ctx.createLinearGradient(0,5,256,10);

					for(var i = 0; i < length; i++){
						grad.addColorStop(1/(length-1) * i, gradArr[i].value);
					}

					ctx.fillStyle = grad;
					ctx.fillRect(0,5,256,10);
					ctx.strokeStyle = "black";
					ctx.beginPath();

					for(var i = 0; i < length; i++){
						ctx.moveTo(((1/(length-1)*i*256) >> 0)+.5, 0);
						ctx.lineTo(((1/(length-1)*i*256) >> 0)+.5, (i==0)?15:5);
					}
					ctx.moveTo(255.5, 0);
					ctx.lineTo(255.5, 15);
					ctx.moveTo(255.5, 4.5);
					ctx.lineTo(0, 4.5);

					ctx.stroke();

					// we re-use the context for measuring the legends label widths
					me.set("ctx", ctx);

					return canvas.toDataURL();
				},
				getElement: function(){
					return this.get("element");
				},
				update: function(max){
					var me = this,
						gradient = me.get("gradientArr"),
						ctx = me.get("ctx"),
						labels = me.get("labelsEl"),
						labelText, labelsHtml = "", offset;

					for(var i = 0; i < gradient.length; i++){
						//labelText = max*gradient[i].stop >> 0;
						labelText = max*gradient[i].stop;
						offset = (ctx.measureText(labelText).width/2) >> 0;

						if(i == 0){
							offset = 0;
						}
						if(i == gradient.length-1){
							offset *= 2;
						}
						labelsHtml += '<li style="position:absolute;left:'+(((((1/(gradient.length-1)*i*256) || 0)) >> 0)-offset+.5)+'px">'+labelText+'</li>';
					}       
					labels.innerHTML = labelsHtml;
				}
			}; 

			return HeatMapLegend;

		})();
	});

}).call(this);
