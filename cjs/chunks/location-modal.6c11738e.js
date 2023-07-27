"use strict";var e=require("react/jsx-runtime"),t=require("@lifesg/react-design-system"),r=require("./index.fbd6a0b0.js"),n=require("react");require("react-dom/server");var o=require("styled-components"),a=require("@lifesg/react-icons/cross");function l(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}require("events"),require("buffer"),require("react-dom"),require("@lifesg/react-icons/pin-fill");var i=l(o);const s="https://assets.life.gov.sg/web-frontend-engine/img/common/no-network.png";!function(e,t){void 0===t&&(t={});var r=t.insertAt;if(e&&"undefined"!=typeof document){var n=document.head||document.getElementsByTagName("head")[0],o=document.createElement("style");o.type="text/css","top"===r&&n.firstChild?n.insertBefore(o,n.firstChild):n.appendChild(o),o.styleSheet?o.styleSheet.cssText=e:o.appendChild(document.createTextNode(e))}}('/* required styles */\r\n\r\n.leaflet-pane,\r\n.leaflet-tile,\r\n.leaflet-marker-icon,\r\n.leaflet-marker-shadow,\r\n.leaflet-tile-container,\r\n.leaflet-pane > svg,\r\n.leaflet-pane > canvas,\r\n.leaflet-zoom-box,\r\n.leaflet-image-layer,\r\n.leaflet-layer {\r\n\tposition: absolute;\r\n\tleft: 0;\r\n\ttop: 0;\r\n\t}\r\n.leaflet-container {\r\n\toverflow: hidden;\r\n\t}\r\n.leaflet-tile,\r\n.leaflet-marker-icon,\r\n.leaflet-marker-shadow {\r\n\t-webkit-user-select: none;\r\n\t   -moz-user-select: none;\r\n\t        user-select: none;\r\n\t  -webkit-user-drag: none;\r\n\t}\r\n/* Prevents IE11 from highlighting tiles in blue */\r\n.leaflet-tile::selection {\r\n\tbackground: transparent;\r\n}\r\n/* Safari renders non-retina tile on retina better with this, but Chrome is worse */\r\n.leaflet-safari .leaflet-tile {\r\n\timage-rendering: -webkit-optimize-contrast;\r\n\t}\r\n/* hack that prevents hw layers "stretching" when loading new tiles */\r\n.leaflet-safari .leaflet-tile-container {\r\n\twidth: 1600px;\r\n\theight: 1600px;\r\n\t-webkit-transform-origin: 0 0;\r\n\t}\r\n.leaflet-marker-icon,\r\n.leaflet-marker-shadow {\r\n\tdisplay: block;\r\n\t}\r\n/* .leaflet-container svg: reset svg max-width decleration shipped in Joomla! (joomla.org) 3.x */\r\n/* .leaflet-container img: map is broken in FF if you have max-width: 100% on tiles */\r\n.leaflet-container .leaflet-overlay-pane svg {\r\n\tmax-width: none !important;\r\n\tmax-height: none !important;\r\n\t}\r\n.leaflet-container .leaflet-marker-pane img,\r\n.leaflet-container .leaflet-shadow-pane img,\r\n.leaflet-container .leaflet-tile-pane img,\r\n.leaflet-container img.leaflet-image-layer,\r\n.leaflet-container .leaflet-tile {\r\n\tmax-width: none !important;\r\n\tmax-height: none !important;\r\n\twidth: auto;\r\n\tpadding: 0;\r\n\t}\r\n\r\n.leaflet-container img.leaflet-tile {\r\n\t/* See: https://bugs.chromium.org/p/chromium/issues/detail?id=600120 */\r\n\tmix-blend-mode: plus-lighter;\r\n}\r\n\r\n.leaflet-container.leaflet-touch-zoom {\r\n\t-ms-touch-action: pan-x pan-y;\r\n\ttouch-action: pan-x pan-y;\r\n\t}\r\n.leaflet-container.leaflet-touch-drag {\r\n\t-ms-touch-action: pinch-zoom;\r\n\t/* Fallback for FF which doesn\'t support pinch-zoom */\r\n\ttouch-action: none;\r\n\ttouch-action: pinch-zoom;\r\n}\r\n.leaflet-container.leaflet-touch-drag.leaflet-touch-zoom {\r\n\t-ms-touch-action: none;\r\n\ttouch-action: none;\r\n}\r\n.leaflet-container {\r\n\t-webkit-tap-highlight-color: transparent;\r\n}\r\n.leaflet-container a {\r\n\t-webkit-tap-highlight-color: rgba(51, 181, 229, 0.4);\r\n}\r\n.leaflet-tile {\r\n\tfilter: inherit;\r\n\tvisibility: hidden;\r\n\t}\r\n.leaflet-tile-loaded {\r\n\tvisibility: inherit;\r\n\t}\r\n.leaflet-zoom-box {\r\n\twidth: 0;\r\n\theight: 0;\r\n\t-moz-box-sizing: border-box;\r\n\t     box-sizing: border-box;\r\n\tz-index: 800;\r\n\t}\r\n/* workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=888319 */\r\n.leaflet-overlay-pane svg {\r\n\t-moz-user-select: none;\r\n\t}\r\n\r\n.leaflet-pane         { z-index: 400; }\r\n\r\n.leaflet-tile-pane    { z-index: 200; }\r\n.leaflet-overlay-pane { z-index: 400; }\r\n.leaflet-shadow-pane  { z-index: 500; }\r\n.leaflet-marker-pane  { z-index: 600; }\r\n.leaflet-tooltip-pane   { z-index: 650; }\r\n.leaflet-popup-pane   { z-index: 700; }\r\n\r\n.leaflet-map-pane canvas { z-index: 100; }\r\n.leaflet-map-pane svg    { z-index: 200; }\r\n\r\n.leaflet-vml-shape {\r\n\twidth: 1px;\r\n\theight: 1px;\r\n\t}\r\n.lvml {\r\n\tbehavior: url(#default#VML);\r\n\tdisplay: inline-block;\r\n\tposition: absolute;\r\n\t}\r\n\r\n\r\n/* control positioning */\r\n\r\n.leaflet-control {\r\n\tposition: relative;\r\n\tz-index: 800;\r\n\tpointer-events: visiblePainted; /* IE 9-10 doesn\'t have auto */\r\n\tpointer-events: auto;\r\n\t}\r\n.leaflet-top,\r\n.leaflet-bottom {\r\n\tposition: absolute;\r\n\tz-index: 1000;\r\n\tpointer-events: none;\r\n\t}\r\n.leaflet-top {\r\n\ttop: 0;\r\n\t}\r\n.leaflet-right {\r\n\tright: 0;\r\n\t}\r\n.leaflet-bottom {\r\n\tbottom: 0;\r\n\t}\r\n.leaflet-left {\r\n\tleft: 0;\r\n\t}\r\n.leaflet-control {\r\n\tfloat: left;\r\n\tclear: both;\r\n\t}\r\n.leaflet-right .leaflet-control {\r\n\tfloat: right;\r\n\t}\r\n.leaflet-top .leaflet-control {\r\n\tmargin-top: 10px;\r\n\t}\r\n.leaflet-bottom .leaflet-control {\r\n\tmargin-bottom: 10px;\r\n\t}\r\n.leaflet-left .leaflet-control {\r\n\tmargin-left: 10px;\r\n\t}\r\n.leaflet-right .leaflet-control {\r\n\tmargin-right: 10px;\r\n\t}\r\n\r\n\r\n/* zoom and fade animations */\r\n\r\n.leaflet-fade-anim .leaflet-popup {\r\n\topacity: 0;\r\n\t-webkit-transition: opacity 0.2s linear;\r\n\t   -moz-transition: opacity 0.2s linear;\r\n\t        transition: opacity 0.2s linear;\r\n\t}\r\n.leaflet-fade-anim .leaflet-map-pane .leaflet-popup {\r\n\topacity: 1;\r\n\t}\r\n.leaflet-zoom-animated {\r\n\t-webkit-transform-origin: 0 0;\r\n\t    -ms-transform-origin: 0 0;\r\n\t        transform-origin: 0 0;\r\n\t}\r\nsvg.leaflet-zoom-animated {\r\n\twill-change: transform;\r\n}\r\n\r\n.leaflet-zoom-anim .leaflet-zoom-animated {\r\n\t-webkit-transition: -webkit-transform 0.25s cubic-bezier(0,0,0.25,1);\r\n\t   -moz-transition:    -moz-transform 0.25s cubic-bezier(0,0,0.25,1);\r\n\t        transition:         transform 0.25s cubic-bezier(0,0,0.25,1);\r\n\t}\r\n.leaflet-zoom-anim .leaflet-tile,\r\n.leaflet-pan-anim .leaflet-tile {\r\n\t-webkit-transition: none;\r\n\t   -moz-transition: none;\r\n\t        transition: none;\r\n\t}\r\n\r\n.leaflet-zoom-anim .leaflet-zoom-hide {\r\n\tvisibility: hidden;\r\n\t}\r\n\r\n\r\n/* cursors */\r\n\r\n.leaflet-interactive {\r\n\tcursor: pointer;\r\n\t}\r\n.leaflet-grab {\r\n\tcursor: -webkit-grab;\r\n\tcursor:    -moz-grab;\r\n\tcursor:         grab;\r\n\t}\r\n.leaflet-crosshair,\r\n.leaflet-crosshair .leaflet-interactive {\r\n\tcursor: crosshair;\r\n\t}\r\n.leaflet-popup-pane,\r\n.leaflet-control {\r\n\tcursor: auto;\r\n\t}\r\n.leaflet-dragging .leaflet-grab,\r\n.leaflet-dragging .leaflet-grab .leaflet-interactive,\r\n.leaflet-dragging .leaflet-marker-draggable {\r\n\tcursor: move;\r\n\tcursor: -webkit-grabbing;\r\n\tcursor:    -moz-grabbing;\r\n\tcursor:         grabbing;\r\n\t}\r\n\r\n/* marker & overlays interactivity */\r\n.leaflet-marker-icon,\r\n.leaflet-marker-shadow,\r\n.leaflet-image-layer,\r\n.leaflet-pane > svg path,\r\n.leaflet-tile-container {\r\n\tpointer-events: none;\r\n\t}\r\n\r\n.leaflet-marker-icon.leaflet-interactive,\r\n.leaflet-image-layer.leaflet-interactive,\r\n.leaflet-pane > svg path.leaflet-interactive,\r\nsvg.leaflet-image-layer.leaflet-interactive path {\r\n\tpointer-events: visiblePainted; /* IE 9-10 doesn\'t have auto */\r\n\tpointer-events: auto;\r\n\t}\r\n\r\n/* visual tweaks */\r\n\r\n.leaflet-container {\r\n\tbackground: #ddd;\r\n\toutline-offset: 1px;\r\n\t}\r\n.leaflet-container a {\r\n\tcolor: #0078A8;\r\n\t}\r\n.leaflet-zoom-box {\r\n\tborder: 2px dotted #38f;\r\n\tbackground: rgba(255,255,255,0.5);\r\n\t}\r\n\r\n\r\n/* general typography */\r\n.leaflet-container {\r\n\tfont-family: "Helvetica Neue", Arial, Helvetica, sans-serif;\r\n\tfont-size: 12px;\r\n\tfont-size: 0.75rem;\r\n\tline-height: 1.5;\r\n\t}\r\n\r\n\r\n/* general toolbar styles */\r\n\r\n.leaflet-bar {\r\n\tbox-shadow: 0 1px 5px rgba(0,0,0,0.65);\r\n\tborder-radius: 4px;\r\n\t}\r\n.leaflet-bar a {\r\n\tbackground-color: #fff;\r\n\tborder-bottom: 1px solid #ccc;\r\n\twidth: 26px;\r\n\theight: 26px;\r\n\tline-height: 26px;\r\n\tdisplay: block;\r\n\ttext-align: center;\r\n\ttext-decoration: none;\r\n\tcolor: black;\r\n\t}\r\n.leaflet-bar a,\r\n.leaflet-control-layers-toggle {\r\n\tbackground-position: 50% 50%;\r\n\tbackground-repeat: no-repeat;\r\n\tdisplay: block;\r\n\t}\r\n.leaflet-bar a:hover,\r\n.leaflet-bar a:focus {\r\n\tbackground-color: #f4f4f4;\r\n\t}\r\n.leaflet-bar a:first-child {\r\n\tborder-top-left-radius: 4px;\r\n\tborder-top-right-radius: 4px;\r\n\t}\r\n.leaflet-bar a:last-child {\r\n\tborder-bottom-left-radius: 4px;\r\n\tborder-bottom-right-radius: 4px;\r\n\tborder-bottom: none;\r\n\t}\r\n.leaflet-bar a.leaflet-disabled {\r\n\tcursor: default;\r\n\tbackground-color: #f4f4f4;\r\n\tcolor: #bbb;\r\n\t}\r\n\r\n.leaflet-touch .leaflet-bar a {\r\n\twidth: 30px;\r\n\theight: 30px;\r\n\tline-height: 30px;\r\n\t}\r\n.leaflet-touch .leaflet-bar a:first-child {\r\n\tborder-top-left-radius: 2px;\r\n\tborder-top-right-radius: 2px;\r\n\t}\r\n.leaflet-touch .leaflet-bar a:last-child {\r\n\tborder-bottom-left-radius: 2px;\r\n\tborder-bottom-right-radius: 2px;\r\n\t}\r\n\r\n/* zoom control */\r\n\r\n.leaflet-control-zoom-in,\r\n.leaflet-control-zoom-out {\r\n\tfont: bold 18px \'Lucida Console\', Monaco, monospace;\r\n\ttext-indent: 1px;\r\n\t}\r\n\r\n.leaflet-touch .leaflet-control-zoom-in, .leaflet-touch .leaflet-control-zoom-out  {\r\n\tfont-size: 22px;\r\n\t}\r\n\r\n\r\n/* layers control */\r\n\r\n.leaflet-control-layers {\r\n\tbox-shadow: 0 1px 5px rgba(0,0,0,0.4);\r\n\tbackground: #fff;\r\n\tborder-radius: 5px;\r\n\t}\r\n.leaflet-control-layers-toggle {\r\n\tbackground-image: url(images/layers.png);\r\n\twidth: 36px;\r\n\theight: 36px;\r\n\t}\r\n.leaflet-retina .leaflet-control-layers-toggle {\r\n\tbackground-image: url(images/layers-2x.png);\r\n\tbackground-size: 26px 26px;\r\n\t}\r\n.leaflet-touch .leaflet-control-layers-toggle {\r\n\twidth: 44px;\r\n\theight: 44px;\r\n\t}\r\n.leaflet-control-layers .leaflet-control-layers-list,\r\n.leaflet-control-layers-expanded .leaflet-control-layers-toggle {\r\n\tdisplay: none;\r\n\t}\r\n.leaflet-control-layers-expanded .leaflet-control-layers-list {\r\n\tdisplay: block;\r\n\tposition: relative;\r\n\t}\r\n.leaflet-control-layers-expanded {\r\n\tpadding: 6px 10px 6px 6px;\r\n\tcolor: #333;\r\n\tbackground: #fff;\r\n\t}\r\n.leaflet-control-layers-scrollbar {\r\n\toverflow-y: scroll;\r\n\toverflow-x: hidden;\r\n\tpadding-right: 5px;\r\n\t}\r\n.leaflet-control-layers-selector {\r\n\tmargin-top: 2px;\r\n\tposition: relative;\r\n\ttop: 1px;\r\n\t}\r\n.leaflet-control-layers label {\r\n\tdisplay: block;\r\n\tfont-size: 13px;\r\n\tfont-size: 1.08333em;\r\n\t}\r\n.leaflet-control-layers-separator {\r\n\theight: 0;\r\n\tborder-top: 1px solid #ddd;\r\n\tmargin: 5px -10px 5px -6px;\r\n\t}\r\n\r\n/* Default icon URLs */\r\n.leaflet-default-icon-path { /* used only in path-guessing heuristic, see L.Icon.Default */\r\n\tbackground-image: url(images/marker-icon.png);\r\n\t}\r\n\r\n\r\n/* attribution and scale controls */\r\n\r\n.leaflet-container .leaflet-control-attribution {\r\n\tbackground: #fff;\r\n\tbackground: rgba(255, 255, 255, 0.8);\r\n\tmargin: 0;\r\n\t}\r\n.leaflet-control-attribution,\r\n.leaflet-control-scale-line {\r\n\tpadding: 0 5px;\r\n\tcolor: #333;\r\n\tline-height: 1.4;\r\n\t}\r\n.leaflet-control-attribution a {\r\n\ttext-decoration: none;\r\n\t}\r\n.leaflet-control-attribution a:hover,\r\n.leaflet-control-attribution a:focus {\r\n\ttext-decoration: underline;\r\n\t}\r\n.leaflet-attribution-flag {\r\n\tdisplay: inline !important;\r\n\tvertical-align: baseline !important;\r\n\twidth: 1em;\r\n\theight: 0.6669em;\r\n\t}\r\n.leaflet-left .leaflet-control-scale {\r\n\tmargin-left: 5px;\r\n\t}\r\n.leaflet-bottom .leaflet-control-scale {\r\n\tmargin-bottom: 5px;\r\n\t}\r\n.leaflet-control-scale-line {\r\n\tborder: 2px solid #777;\r\n\tborder-top: none;\r\n\tline-height: 1.1;\r\n\tpadding: 2px 5px 1px;\r\n\twhite-space: nowrap;\r\n\t-moz-box-sizing: border-box;\r\n\t     box-sizing: border-box;\r\n\tbackground: rgba(255, 255, 255, 0.8);\r\n\ttext-shadow: 1px 1px #fff;\r\n\t}\r\n.leaflet-control-scale-line:not(:first-child) {\r\n\tborder-top: 2px solid #777;\r\n\tborder-bottom: none;\r\n\tmargin-top: -2px;\r\n\t}\r\n.leaflet-control-scale-line:not(:first-child):not(:last-child) {\r\n\tborder-bottom: 2px solid #777;\r\n\t}\r\n\r\n.leaflet-touch .leaflet-control-attribution,\r\n.leaflet-touch .leaflet-control-layers,\r\n.leaflet-touch .leaflet-bar {\r\n\tbox-shadow: none;\r\n\t}\r\n.leaflet-touch .leaflet-control-layers,\r\n.leaflet-touch .leaflet-bar {\r\n\tborder: 2px solid rgba(0,0,0,0.2);\r\n\tbackground-clip: padding-box;\r\n\t}\r\n\r\n\r\n/* popup */\r\n\r\n.leaflet-popup {\r\n\tposition: absolute;\r\n\ttext-align: center;\r\n\tmargin-bottom: 20px;\r\n\t}\r\n.leaflet-popup-content-wrapper {\r\n\tpadding: 1px;\r\n\ttext-align: left;\r\n\tborder-radius: 12px;\r\n\t}\r\n.leaflet-popup-content {\r\n\tmargin: 13px 24px 13px 20px;\r\n\tline-height: 1.3;\r\n\tfont-size: 13px;\r\n\tfont-size: 1.08333em;\r\n\tmin-height: 1px;\r\n\t}\r\n.leaflet-popup-content p {\r\n\tmargin: 17px 0;\r\n\tmargin: 1.3em 0;\r\n\t}\r\n.leaflet-popup-tip-container {\r\n\twidth: 40px;\r\n\theight: 20px;\r\n\tposition: absolute;\r\n\tleft: 50%;\r\n\tmargin-top: -1px;\r\n\tmargin-left: -20px;\r\n\toverflow: hidden;\r\n\tpointer-events: none;\r\n\t}\r\n.leaflet-popup-tip {\r\n\twidth: 17px;\r\n\theight: 17px;\r\n\tpadding: 1px;\r\n\r\n\tmargin: -10px auto 0;\r\n\tpointer-events: auto;\r\n\r\n\t-webkit-transform: rotate(45deg);\r\n\t   -moz-transform: rotate(45deg);\r\n\t    -ms-transform: rotate(45deg);\r\n\t        transform: rotate(45deg);\r\n\t}\r\n.leaflet-popup-content-wrapper,\r\n.leaflet-popup-tip {\r\n\tbackground: white;\r\n\tcolor: #333;\r\n\tbox-shadow: 0 3px 14px rgba(0,0,0,0.4);\r\n\t}\r\n.leaflet-container a.leaflet-popup-close-button {\r\n\tposition: absolute;\r\n\ttop: 0;\r\n\tright: 0;\r\n\tborder: none;\r\n\ttext-align: center;\r\n\twidth: 24px;\r\n\theight: 24px;\r\n\tfont: 16px/24px Tahoma, Verdana, sans-serif;\r\n\tcolor: #757575;\r\n\ttext-decoration: none;\r\n\tbackground: transparent;\r\n\t}\r\n.leaflet-container a.leaflet-popup-close-button:hover,\r\n.leaflet-container a.leaflet-popup-close-button:focus {\r\n\tcolor: #585858;\r\n\t}\r\n.leaflet-popup-scrolled {\r\n\toverflow: auto;\r\n\t}\r\n\r\n.leaflet-oldie .leaflet-popup-content-wrapper {\r\n\t-ms-zoom: 1;\r\n\t}\r\n.leaflet-oldie .leaflet-popup-tip {\r\n\twidth: 24px;\r\n\tmargin: 0 auto;\r\n\r\n\t-ms-filter: "progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)";\r\n\tfilter: progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678);\r\n\t}\r\n\r\n.leaflet-oldie .leaflet-control-zoom,\r\n.leaflet-oldie .leaflet-control-layers,\r\n.leaflet-oldie .leaflet-popup-content-wrapper,\r\n.leaflet-oldie .leaflet-popup-tip {\r\n\tborder: 1px solid #999;\r\n\t}\r\n\r\n\r\n/* div icon */\r\n\r\n.leaflet-div-icon {\r\n\tbackground: #fff;\r\n\tborder: 1px solid #666;\r\n\t}\r\n\r\n\r\n/* Tooltip */\r\n/* Base styles for the element that has a tooltip */\r\n.leaflet-tooltip {\r\n\tposition: absolute;\r\n\tpadding: 6px;\r\n\tbackground-color: #fff;\r\n\tborder: 1px solid #fff;\r\n\tborder-radius: 3px;\r\n\tcolor: #222;\r\n\twhite-space: nowrap;\r\n\t-webkit-user-select: none;\r\n\t-moz-user-select: none;\r\n\t-ms-user-select: none;\r\n\tuser-select: none;\r\n\tpointer-events: none;\r\n\tbox-shadow: 0 1px 3px rgba(0,0,0,0.4);\r\n\t}\r\n.leaflet-tooltip.leaflet-interactive {\r\n\tcursor: pointer;\r\n\tpointer-events: auto;\r\n\t}\r\n.leaflet-tooltip-top:before,\r\n.leaflet-tooltip-bottom:before,\r\n.leaflet-tooltip-left:before,\r\n.leaflet-tooltip-right:before {\r\n\tposition: absolute;\r\n\tpointer-events: none;\r\n\tborder: 6px solid transparent;\r\n\tbackground: transparent;\r\n\tcontent: "";\r\n\t}\r\n\r\n/* Directions */\r\n\r\n.leaflet-tooltip-bottom {\r\n\tmargin-top: 6px;\r\n}\r\n.leaflet-tooltip-top {\r\n\tmargin-top: -6px;\r\n}\r\n.leaflet-tooltip-bottom:before,\r\n.leaflet-tooltip-top:before {\r\n\tleft: 50%;\r\n\tmargin-left: -6px;\r\n\t}\r\n.leaflet-tooltip-top:before {\r\n\tbottom: 0;\r\n\tmargin-bottom: -12px;\r\n\tborder-top-color: #fff;\r\n\t}\r\n.leaflet-tooltip-bottom:before {\r\n\ttop: 0;\r\n\tmargin-top: -12px;\r\n\tmargin-left: -6px;\r\n\tborder-bottom-color: #fff;\r\n\t}\r\n.leaflet-tooltip-left {\r\n\tmargin-left: -6px;\r\n}\r\n.leaflet-tooltip-right {\r\n\tmargin-left: 6px;\r\n}\r\n.leaflet-tooltip-left:before,\r\n.leaflet-tooltip-right:before {\r\n\ttop: 50%;\r\n\tmargin-top: -6px;\r\n\t}\r\n.leaflet-tooltip-left:before {\r\n\tright: 0;\r\n\tmargin-right: -12px;\r\n\tborder-left-color: #fff;\r\n\t}\r\n.leaflet-tooltip-right:before {\r\n\tleft: 0;\r\n\tmargin-left: -12px;\r\n\tborder-right-color: #fff;\r\n\t}\r\n\r\n/* Printing */\r\n\r\n@media print {\r\n\t/* Prevent printers from removing background-images of controls. */\r\n\t.leaflet-control {\r\n\t\t-webkit-print-color-adjust: exact;\r\n\t\tprint-color-adjust: exact;\r\n\t\t}\r\n\t}\r\n');const d=({lat:e,lng:t},n,o)=>{const a=o?44:32;return r.leafletSrc.exports.marker([e,t],{icon:r.leafletSrc.exports.icon({iconUrl:n,iconSize:[a,a],iconAnchor:[a/2,a]})})},c=e=>{e&&e.forEach((e=>e.remove()))},p=i.default.div`
	position: relative;
`,f=i.default.div`
	width: 100%;
	height: 100%;

	.leaflet-control-container .leaflet-control {
		&-zoom {
			position: absolute;
			right: 1.5rem;
			bottom: 6rem;
			width: 2.5rem;
			height: 5rem;
			margin: 0;
			border: 0;

			&-in,
			&-out {
				height: 50%;
			}

			&.leaflet-bar {
				border-radius: 1.25rem;
				overflow: hidden;
				box-shadow: 0 0.125rem 0.25rem ${r.fr.Neutral[1]}66;
			}

			&.leaflet-bar a {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				height: 50%;
				color: ${r.fr.Primary};
				font-weight: bold;

				&.leaflet-control-zoom-in {
					border-bottom-color: ${r.fr.Neutral[5]};
				}
			}
		}

		&-attribution {
			font-size: 0 !important;

			*:not(.onemap):not(.onemap *) {
				display: none !important;
			}

			.onemap {
				font-size: 0.6875rem;
			}
		}
	}
`,u=i.default.button`
	position: absolute;
	right: 1.5rem;
	bottom: 2.5rem;
	z-index: 1000;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 2.5rem;
	height: 2.5rem;
	border: 0;
	border-radius: 50%;
	padding: 0;
	background: ${r.fr.Neutral[8]};
	cursor: pointer;
	box-shadow: 0 0.125rem 0.25rem ${r.fr.Neutral[1]}66;
`,g=i.default.img`
	width: 1.5rem;
	height: 1.5rem;
`,m=i.default(r.He.Box)`
	flex-direction: row;
	width: 70%;
	max-width: 45rem;
	height: 40rem;

	// set z-index to get past safari border-radius issue
	z-index: 1;

	${({locationModalStyles:e})=>{if(e)return`${e}`}}

	${r.d.MaxWidth.tablet} {
		flex-direction: column;
		height: 90%;
		max-height: 90%;
	}

	${r.d.MaxWidth.mobileL}, (orientation: landscape) and (max-height: ${r.i.mobileL}px) {
		height: 100%;
		width: 100%;
		flex-direction: column;
		max-width: none;
		max-height: none;
		border-radius: 0;
	}
`,h=i.default((({id:o="location-picker",className:a,mapPanZoom:l,panelInputMode:i,showLocationModal:s,selectedLocationCoord:m,interactiveMapPinIconUrl:h="https://assets.life.gov.sg/web-frontend-engine/img/icons/location-pin-blue.svg",getCurrentLocation:b,locationAvailable:x,gettingCurrentLocation:v,onMapCenterChange:y})=>{const w=n.useRef(),k=n.useRef(null),M=n.useRef(),z=window.matchMedia(`(max-width: ${t.MediaWidths.tablet}px)`).matches,C=11;n.useEffect((()=>{if(k.current&&s){w.current||(w.current=r.leafletSrc.exports.map(k.current,{zoomControl:!1}),L(),r.leafletSrc.exports.control.zoom({position:"bottomright"}).addTo(w.current));const e=r.leafletSrc.exports.tileLayer("https://maps-{s}.onemap.sg/v3/Default/{z}/{x}/{y}.png",{detectRetina:!0,maxNativeZoom:18,maxZoom:z?20:19,minZoom:C,attribution:'<div class="onemap"><img src="https://www.onemap.gov.sg/docs/maps/images/oneMap64-01.png" style="height:20px;width:20px;"/> OneMap | Map data &copy; contributors, <a href="http://SLA.gov.sg">Singapore Land Authority</a></div>'});w.current.setMaxBounds(r.LocationHelper.getMapBounds()),e.addTo(w.current),!v&&m?.lat&&m?.lng&&T({lat:m.lat,lng:m.lng});const t=w.current;t.on("click",(({latlng:e})=>{v||y(e)})),t.on("zoomend",(()=>t.setMinZoom(l?.min??C)))}else w.current&&(w.current?.off(),w.current?.remove(),w.current=void 0)}),[s]),n.useEffect((()=>{m?.lat&&m?.lng?T(m):L()}),[m?.lat,m?.lng]);const L=()=>{if(w.current){c(M.current);const e=r.leafletSrc.exports.bounds([1.56073,104.11475],[1.16,103.502]).getCenter();w.current.setView([e.x,e.y],12),setTimeout((()=>w.current?.invalidateSize()),500)}},T=e=>{const t=w.current;if(!t)return;c(M.current),M.current=[d(e,h).addTo(t)];const n=Math.max(l?.min??C,z?l?.mobile??18:l?.nonMobile??17),o=t.getBounds().contains([e.lat,e.lng])&&t.getZoom()>n?t.getZoom():n;t.flyTo(r.leafletSrc.exports.latLng(e.lat,e.lng),o),setTimeout((()=>t.invalidateSize()),500)};return e.jsxs(p,{className:a,id:r.TestHelper.generateId(o,"location-picker"),"data-testid":r.TestHelper.generateId(o,"location-picker","search"===i?"hide":"show"),children:[e.jsx(f,{ref:k}),e.jsx(u,{onClick:()=>{x&&b()},children:e.jsx(g,{src:x?"https://assets.life.gov.sg/web-frontend-engine/img/icons/current-location.svg":"https://assets.life.gov.sg/web-frontend-engine/img/icons/current-location-unavailable.svg",alt:"Current location "+(x?"available":"unavailable")})})]})}))`
	width: 48.89%;

	${r.d.MaxWidth.tablet}, (orientation: landscape) and (max-height: ${r.i.mobileL}px) {
		display: ${({panelInputMode:e})=>"map"!==e?"none":"block"};
		position: relative;
		left: 0;
		width: 100%;
		margin-top: 1rem;
		height: calc(100% - 13rem);
	}
`,b=i.default.img`
	display: block;
	margin: 0 auto 2rem;
	width: 10.5rem;
	height: 8rem;

	${r.d.MaxWidth.mobileL} {
		margin-top: 2.5rem;
	}
`,x=i.default.img`
	display: none;
`;function v(){var e=new Map;return{getObserver:function(t){var r=t.root,n=t.rootMargin,o=t.threshold,a=e.get(r);a||(a=new Map,e.set(r,a));var l=JSON.stringify({rootMargin:n,threshold:o}),i=a.get(l);if(!i){var s=new Map,d=new IntersectionObserver((function(e){e.forEach((function(e){var t=s.get(e.target);null==t||t(e)}))}),{root:r,rootMargin:n,threshold:o});i={observer:d,entryCallbacks:s},a.set(l,i)}return{observe:function(e,t){var r,n;null==(r=i)||r.entryCallbacks.set(e,t),null==(n=i)||n.observer.observe(e)},unobserve:function(e){var t,r;null==(t=i)||t.entryCallbacks.delete(e),null==(r=i)||r.observer.unobserve(e)}}}}}var y="0px",w=[0],k=v();function M(){return M=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},M.apply(this,arguments)}function z(e){var t,r=function(e){var t,r,o=null!=(t=null==e?void 0:e.rootMargin)?t:y,a=null!=(r=null==e?void 0:e.threshold)?r:w,l=n.useRef(null),i=n.useRef(null),s=n.useRef(null),d=n.useState(),c=d[0],p=d[1],f=n.useCallback((function(){var e=l.current;if(e){var t=k.getObserver({root:i.current,rootMargin:o,threshold:a});t.observe(e,(function(e){p(e)})),s.current=t}else p(void 0)}),[o,a]),u=n.useCallback((function(){var e=s.current,t=l.current;t&&(null==e||e.unobserve(t)),s.current=null}),[]);return[n.useCallback((function(e){u(),l.current=e,f()}),[f,u]),{entry:c,rootRef:n.useCallback((function(e){u(),i.current=e,f()}),[f,u])}]}(e),o=r[0],a=r[1],l=Boolean(null==(t=a.entry)?void 0:t.isIntersecting),i=n.useState(l),s=i[0],d=i[1];return l&&!s&&d(!0),[o,M({},a,{isVisible:l,wasEverVisible:s})]}const C=i.default.div`
	padding: 0.5rem;
	text-align: center;
`,L=i.default.div`
	display: inline-block;
	position: relative;
	width: ${1.5}rem;
	height: ${1.5}rem;
`,T=o.keyframes`
  0% {
	background-color: #8e8e93;
  }
  100% {
	background-color: #EEE;
  }
`,$=i.default.div`
	transform-origin: ${.75}rem ${.75}rem;

	&::after {
		content: " ";
		display: block;
		position: absolute;
		top: 0.125rem;
		left: ${.65625}rem;
		width: ${3/16}rem;
		height: ${6.5/16}rem;
		border-radius: ${1.5/16}rem;
		animation: ${T} ${.8}s linear infinite;
	}

	${Array(8).fill("").map(((e,t)=>`\n\t\t\t\t&:nth-child(${t+1}) {\n\t\t\t\t\ttransform: rotate(${360*t/8}deg);\n\t\t\t\t}\n\n\t\t\t\t&:nth-child(${t+1})::after {\n\t\t\t\t\tanimation-delay: -${(8-t)/10}s;\n\t\t\t\t}\n\t\t\t`))}
`,S=t=>e.jsx(L,{...t,children:Array(8).fill("").map(((t,r)=>e.jsx($,{},r)))}),E=t=>{const{loading:r,items:o,hasNextPage:a,error:l,loadMore:i,rootMargin:s="0px 0px 50px 0px"}=t,[d]=function(e){var t=e.loading,r=e.hasNextPage,o=e.onLoadMore,a=e.rootMargin,l=e.disabled,i=e.delayInMs,s=void 0===i?100:i,d=z({rootMargin:a}),c=d[0],p=d[1],f=p.rootRef,u=p.isVisible,g=!l&&!t&&u&&r;return n.useEffect((function(){if(g){var e=setTimeout((function(){o()}),s);return function(){clearTimeout(e)}}}),[o,g,s]),[c,{rootRef:f}]}({loading:r,hasNextPage:a,onLoadMore:i,disabled:!!l,rootMargin:s});return e.jsxs(e.Fragment,{children:[o,(r||a)&&e.jsx(C,{"data-testid":"InfiniteScrollList__InfiniteListItem-sentryRef",ref:d,children:e.jsx(S,{})})]})},j=(e,t,r)=>e.slice((r-1)*t,r*t),I=(e,t)=>{const r=new RegExp(t,"gi");return e.map((e=>{const n=(e.displayAddressText||e.address).replace(r,`<span class="keyword">${t}</span>`);return{...e,displayAddressText:n}}))},P=i.default.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	padding: 2rem 1.5rem 1rem;

	${t.MediaQuery.MaxWidth.tablet}, (orientation: landscape) and (max-height: ${t.MediaWidths.mobileL}px) {
		flex: unset;
		height: ${({panelInputMode:e})=>"search"===e?"100%":"auto"};
		padding: 1.5rem 1.25rem 0;
	}
`,H=i.default.div`
	position: relative;
	display: flex;
	gap: 0.5rem;
	padding-bottom: 0.4rem;
	alight-items: center;
	justify-content: space-between;
	border-bottom: 1px solid ${t.Color.Neutral[5]};
	clip-path: inset(0 0 -0.3rem 0);
	transition: box-shadow 0.3s linear;

	${({hasScrolled:e})=>e?"box-shadow: 0 0.06rem 0.4rem rgba(0,0,0,.12);":""}

	&:focus-within {
		border-bottom: 1px solid ${t.Color.Accent.Light[1]};
	}

	${t.MediaQuery.MaxWidth.tablet}, (orientation: landscape) and (max-height: ${t.MediaWidths.mobileL}px) {
		margin: 0.8rem 0 0;
	}
`,N=i.default.button`
	display: flex;
	width: fit-content;
	align-items: center;
	background: none;
	border: none;
	padding: 0;
	margin: 0;
	cursor: pointer;
`,A=i.default.img`
	width: 1rem;
	height: auto;
`,F=i.default.input`
	border: none;
	width: 100%;
	margin: 0;
	padding: 0;
	font-size: 1rem;
	outline: none;

	::placeholder,
	::-webkit-input-placeholder {
		color: ${t.Color.Neutral[4]};
	}
`,O=i.default(a.CrossIcon)`
	display: none;
	font-size: 1.5rem;
	color: ${t.Color.Primary};

	${t.MediaQuery.MaxWidth.tablet}, (orientation: landscape) and (max-height: ${t.MediaWidths.mobileL}px) {
		display: block;
		margin: -0.4rem 0 0 -0.4rem;
	}
`,W=i.default(a.CrossIcon)`
	font-size: 1.7rem;
	color: ${t.Color.Neutral[4]};
`,R=i.default.div`
	overflow-y: auto;
	flex: 1;
	border-bottom: solid 1px ${t.Color.Neutral[5]};

	${t.MediaQuery.MaxWidth.tablet}, (orientation: landscape) and (max-height: ${t.MediaWidths.mobileL}px) {
		display: ${({panelInputMode:e})=>"map"!==e?"block":"none"};
		border-bottom: 0;
	}
`,G=i.default(t.Text.H5)`
	border-bottom: 1px solid ${t.Color.Neutral[5]};
	padding: 1rem 0;
`,B=i.default(t.Text.BodySmall)`
	padding-top: 1rem;
	color: ${t.Color.Neutral[4]};
	word-break: break-all;
	overflow-y: scroll;
`,q=i.default.div`
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 1rem 1rem 1rem 0;
	border-bottom: 1px solid ${t.Color.Neutral[5]};
	text-transform: uppercase;
	cursor: pointer;
	background-color: ${({active:e})=>e?t.Color.Accent.Light[5]:"transparent"};

	.keyword {
		font-family: "Open Sans Semibold";
	}
`,V=i.default.img`
	width: 1rem;
`,D=i.default.div`
	display: flex;
	justify-content: center;
	gap: 1rem;
	padding-top: 1rem;

	${t.MediaQuery.MaxWidth.tablet}, (orientation: landscape) and (max-height: ${t.MediaWidths.mobileL}px) {
		display: ${({panelInputMode:e})=>"map"===e?"block":"none"};
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		padding: 1.5rem 1.25rem 1.93rem;
	}
`,Z=i.default(t.Button.Default)`
	width: 9.5rem;

	${t.MediaQuery.MaxWidth.tablet}, (orientation: landscape) and (max-height: ${t.MediaWidths.mobileL}px) {
		${({buttonType:e})=>"cancel"===e&&"display: none"}
		${({buttonType:e})=>"confirm"===e&&"width: 100%"}
	}
`,Q=({id:t="location-search",formValues:o,gettingCurrentLocation:a,showLocationModal:l,mustHavePostalCode:i,panelInputMode:s,selectedAddressInfo:d,mapPickedLatLng:c,reverseGeoCodeEndpoint:p,addressFieldPlaceholder:f="Street Name, Postal Code",gettingCurrentLocationFetchMessage:u="Getting current location...",locationListTitle:g="Select location",handleApiErrors:m,onGetLocationCallback:h,onChangeSelectedAddressInfo:b,onCancel:x,onConfirm:v,setSinglePanelMode:y,updateFormValues:w})=>{const{addFieldEventListener:k,removeFieldEventListener:M}=r.useFieldEvent(),z=n.useRef(null),C=n.useRef(null),L=n.useRef(null),[T,$]=n.useState(!1),[S,Q]=n.useState(""),[U,_]=n.useState(!1),[K,J]=n.useState("pristine"),[X,Y]=n.useState(!1),[ee,te]=n.useState(-1),[re,ne]=n.useState([]),[oe,ae]=n.useState([]),le=10,[ie,se]=n.useState(!1),[de,ce]=n.useState(0),[pe,fe]=n.useState(1),[ue,ge]=n.useState(1),{debounceFetchAddress:me,fetchSingleLocationByAddress:he,fetchSingleLocationByLatLng:be,fetchLocationList:xe}=r.LocationHelper,{dispatchFieldEvent:ve}=r.useFieldEvent();n.useEffect((()=>{if(!l)return;Promise.all([me("singapore",1,void 0,m),(async()=>{try{r.LocationHelper.reverseGeocode({route:p,latitude:1.29994179707526,longitude:103.789404349716,bufferRadius:1,abortSignal:L.current.signal,otherFeatures:r.OneMapBoolean.YES})}catch(e){m(new r.OneMapError(e))}})()])}),[]),n.useEffect((()=>{navigator.onLine&&!S&&d?.lat&&d?.lng&&ze(d.lat,d.lng)}),[navigator.onLine]),n.useEffect((()=>{const e=({detail:{payload:e,errors:t}})=>{if(t instanceof Object&&void 0!==t.code)return void m(new r.GeolocationPositionErrorWrapper(t));if(!r.lodash.exports.isEmpty(t))return void m(t);if(!e?.lat||!e?.lng)return;const{lat:n,lng:o}=e;ze(n,o),h(n,o)};return k("set-current-location",t,e),()=>{M("set-current-location",t,e)}}),[]),n.useEffect((()=>{const e=({displayAddressText:e,...t})=>{const n=!i||r.LocationHelper.hasGotAddressValue(t.postalCode);if(r.lodash.exports.isEmpty(t)||!n)return w({}),void b({});w(t),b(t),Q(t.address)};o?.lat&&o?.lng&&o?.address?he(o.address,e,m):!o?.address||o?.lat||o?.lng?p&&!o?.address&&o?.lat&&o?.lng&&be(p,o.lat,o.lng,e,m):he(o.address,e,m)}),[]),n.useEffect((()=>{c?.lat&&c?.lng&&ze(c.lat,c.lng)}),[c?.lat,c?.lng]),n.useEffect((()=>{if("found"===K)return;const e=Le(S);if(!e)return Me();(z.current?.value!==u&&z.current?.value!==d?.address||"pristine"===K)&&Y(!0),me(e,1,(t=>{te(d?.address===e?0:-1),Ce({results:t.results,queryString:S,boldResults:!0,apiPageNum:t.apiPageNum,totalNumPages:t.totalNumPages}),C.current?.scrollTo&&C.current?.scrollTo(0,0)}),(e=>{e instanceof SyntaxError||e instanceof TypeError?Ce({results:[],queryString:S}):(Me(),m(new r.OneMapError(e)))}))}),[le,S]),n.useEffect((()=>{se(!1),pe<de&&se(!0),ue<oe.length/le&&se(!0)}),[de,pe,ue,oe.length,le]);const ye=()=>{o?.address&&o?.lat&&o?.lng?Q(o.address):(Q(""),Me()),J("pristine"),x()},we=()=>{z.current?.focus(),re.length>0&&y("search")},ke=(e,r)=>{!ve("error",t,{payload:{errorType:e}})||r()},Me=()=>{te(-1),ge(1),ce(0),fe(0),ae([]),ne([]),C.current?.scrollTo&&C.current?.scrollTo(0,0)},ze=async(e,t)=>{if(!p)return;const n=e=>{Q(""),m(e)};let o;try{o=await xe(p,e,t,i,L,n,!0)}catch(e){return}if(0===o.length){Q("");return void((d.lat!==e||d.lng!==t)&&b({lat:e,lng:t}))}C.current?.scrollTo(0,0),Ce({results:o});const[{displayAddressText:a,...l}]=o;if(i&&!r.LocationHelper.hasGotAddressValue(l.address))return _(!0),void Q("");Q(l.address),b(l),te(0)},Ce=e=>{const{results:t,boldResults:r,apiPageNum:n,totalNumPages:o,queryString:a}=e;let l=t;if(r&&a&&(l=I(l,a)),l.length>le){const e=j(l,le,1);ne(e)}else ne(l);ae(t),ce(o||1),Y(!1),fe(n||1),J(l.length>0?"found":"not-found")},Le=e=>{if(e)return e.trim().replace(/^[$\s]*/,"")};return e.jsxs(e.Fragment,{children:[e.jsxs(P,{id:r.TestHelper.generateId(t,"location-search"),"data-testid":r.TestHelper.generateId(t,"location-search"),panelInputMode:s,children:[e.jsx(N,{onClick:ye,id:r.TestHelper.generateId(t,"location-search-modal-close"),"data-testid":r.TestHelper.generateId(t,"location-search-modal-close"),children:e.jsx(O,{})}),e.jsxs(H,{hasScrolled:T,children:[e.jsx(N,{onClick:we,id:r.TestHelper.generateId(t,"location-search-modal-search"),children:e.jsx(A,{src:"https://assets.life.gov.sg/web-frontend-engine/img/icons/search.svg",alt:"Search"})}),e.jsx(F,{id:r.TestHelper.generateId(t,"location-search-modal-input"),"data-testid":r.TestHelper.generateId(t,"location-search-modal-input"),type:"text",onFocus:we,onChange:async e=>{const t=e.target.value;Q(t),J("pristine"),y("search")},placeholder:f,readOnly:a,value:a?u:S,ref:z}),e.jsx(N,{onClick:()=>{Q(""),J("pristine"),y("map")},id:r.TestHelper.generateId(t,"location-search-input-clear"),"data-testid":r.TestHelper.generateId(t,"location-search-input-clear"),children:e.jsx(W,{type:"cross"})})]}),e.jsx(R,{id:r.TestHelper.generateId(t,"location-search-results"),"data-testid":r.TestHelper.generateId(t,"location-search-results",s),panelInputMode:s,ref:C,onScroll:()=>{C.current&&(C.current?.scrollTop>0&&!T?$(!0):C.current?.scrollTop<=0&&T&&$(!1))},children:!a&&e.jsxs(e.Fragment,{children:[re.length?e.jsx(G,{children:g}):null,e.jsx(E,{items:re.map(((t,n)=>e.jsxs(q,{onClick:()=>((e,t)=>{const{displayAddressText:n,...o}=e;!i||r.LocationHelper.hasGotAddressValue(o.postalCode)?(J("found"),te(t),Q(o.address??""),b(o)):ke("PostalCodeError",(()=>{_(!0)}))})(t,n),active:ee===n,id:r.TestHelper.generateId(`location-search-modal-search-result-${n+0}`),"data-testid":r.TestHelper.generateId(`location-search-modal-search-result-${n+0}`,void 0,ee===n?"active":void 0),children:[e.jsx(V,{src:"https://assets.life.gov.sg/web-frontend-engine/img/icons/location-pin-black.svg",alt:"Location"}),e.jsx(r.Sanitize,{sanitizeOptions:{allowedTags:["span"],allowedAttributes:{span:["class"]}},children:t.displayAddressText})]},`${n}_${t.lat}_${t.lng}`))),loading:X,hasNextPage:ie,loadMore:()=>{if(Y(!0),re.length<oe.length){const e=ue+1;ge(e);const t=j(oe,le,e),r=I(t,S);ne(re.concat(r)),Y(!1)}else me(S,pe+1,(e=>{const t=I(e.results,S);if(t.length>le){const e=j(t,le,1);ne(re.concat(e))}else ne(re.concat(t));ae(oe.concat(t)),ce(e.totalNumPages),Y(!1),fe(e.apiPageNum)}),(e=>{Me(),m(new r.OneMapError(e))}))}}),!X&&"not-found"===K&&e.jsxs(B,{children:["No results found for “",S,"”"]})]})}),e.jsxs(D,{id:r.TestHelper.generateId(t,"location-search-controls"),"data-testid":r.TestHelper.generateId(t,"location-search-controls"),panelInputMode:s,children:[e.jsx(Z,{buttonType:"cancel",styleType:"light",onClick:ye,children:"Cancel"}),e.jsx(Z,{buttonType:"confirm",onClick:v,disabled:ee<0||"found"!==K,children:"double"!==s?"Confirm location":"Confirm"})]})]}),U&&e.jsx(r.Prompt,{id:`${t}-postal-code-error`,title:"Oops",size:"large",show:!0,description:"The location you have selected does not contain a postal code.",buttons:[{id:"ok",title:"OK",onClick:()=>_(!1)}]})]})},U=i.default.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	/* to take full width of modal */
	flex: 1;
`,_=i.default.img`
	width: 12.5625rem;

	${r.d.MaxWidth.mobileL} {
		width: 11.5rem;
	}
`,K=i.default(r.Oe.Body)`
	text-align: center;
	margin: 1.5rem auto 0.5rem;

	${r.d.MaxWidth.mobileL} {
		font-size: 0.875rem !important;
	}
`,J=i.default(r.Oe.Body)`
	text-align: center;
	width: 100%;

	${r.d.MaxWidth.mobileL} {
		font-size: 0.875rem !important;
		max-width: 14rem;
	}
`,X=i.default(r.Jt.Default)`
	margin-top: 2.5rem;
	width: 100%;
	max-width: 16.5rem;

	${r.d.MaxWidth.mobileL} {
		max-width: 16.5rem;
	}
`,Y=({id:t,cachedImage:n,refreshNetwork:o})=>e.jsxs(U,{id:r.TestHelper.generateId(t,"no-internet-connectivity"),"data-testid":r.TestHelper.generateId(t,"no-internet-connectivity"),children:[e.jsx(_,{src:n,alt:"no-connectivity"}),e.jsx(K,{weight:"semibold",children:"No connection found"}),e.jsx(J,{children:"Check your internet connection and try again."}),e.jsx(X,{onClick:o,children:"Try again"})]});exports.default=({id:o="location-modal",className:a,formValues:l,showLocationModal:i,mapPanZoom:d,interactiveMapPinIconUrl:c,reverseGeoCodeEndpoint:p,gettingCurrentLocationFetchMessage:f,mustHavePostalCode:u,locationModalStyles:g,onClose:v,onConfirm:y,updateFormValues:w})=>{const[k,M]=n.useState("double"),[z,C]=n.useState({}),[L,T]=n.useState(!0),[$,S]=n.useState(!1),{dispatchFieldEvent:E,addFieldEventListener:j,removeFieldEventListener:I}=r.useFieldEvent(),[P,H]=n.useState(!0),[N,A]=n.useState(!1),[F,O]=n.useState(!1),[W,R]=n.useState(!1),[G,B]=n.useState();n.useEffect((()=>{const e=e=>{const t=e.detail?.payload?.errorType;if(t)switch(t){case"OneMapError":case"GetLocationTimeoutError":q()}};return j("error-end",o,e),()=>{I("error-end",o,e)}}),[]),n.useEffect((()=>{if(!window)return;const e=matchMedia(`(max-width: ${t.MediaWidths.tablet}px)`);M(e.matches?"map":"double");const r=()=>H(!0),n=()=>H(!1),o=e=>{M(e.matches?"map":"double")};return window.addEventListener("online",r),window.addEventListener("offline",n),e.addEventListener("change",o),()=>{window.removeEventListener("online",r),window.removeEventListener("offline",n),e.removeEventListener("change",o)}}),[]),n.useEffect((()=>{i?l?.lat||l?.lng||Z():"double"!==k&&M("map")}),[i]),n.useEffect((()=>{r.lodash.exports.isEmpty(z)||"search"!==k||D("map")}),[z,$]);const q=()=>{v()},V=()=>{A(!1)},D=e=>{"double"!==k&&M(e)},Z=async()=>{S(!0);if(!!E("get-current-location",o)){const e={};try{e.payload=await r.GeoLocationHelper.getCurrentLocation()}catch(t){e.errors=t}E("set-current-location",o,e)}},U=()=>{C(l||{})};return e.jsxs(e.Fragment,{children:[e.jsx(x,{src:s,alt:"no internet connectivity"}),e.jsx(t.Modal,{id:r.TestHelper.generateId(o,"modal",i?"show":"hide"),show:i,children:e.jsx(m,{id:r.TestHelper.generateId(o,"modal-box"),className:`${a}-modal-box`,showCloseButton:!1,locationModalStyles:g,children:P?e.jsxs(e.Fragment,{children:[e.jsx(Q,{id:o,onCancel:()=>{U(),q()},onConfirm:()=>{y(z),q()},updateFormValues:w,gettingCurrentLocation:$,panelInputMode:k,selectedAddressInfo:z,mapPickedLatLng:G,formValues:l,onChangeSelectedAddressInfo:C,handleApiErrors:e=>{const t=(t,r)=>{!E("error",o,{payload:{errorType:t},errors:e})||r()};S(!1),e instanceof r.OneMapError?t("OneMapError",(()=>{U(),O(!0)})):(T(!1),e instanceof r.GeolocationPositionErrorWrapper&&e?.code?.toString()===GeolocationPositionError.TIMEOUT.toString()?t("GetLocationTimeoutError",(()=>{R(!0)})):t("GetLocationError",(()=>{A(!0)})))},onGetLocationCallback:()=>{S(!1),T(!0)},setSinglePanelMode:D,showLocationModal:i,reverseGeoCodeEndpoint:p,gettingCurrentLocationFetchMessage:f,mustHavePostalCode:u}),e.jsx(h,{id:o,panelInputMode:k,locationAvailable:L,gettingCurrentLocation:$,showLocationModal:i,selectedLocationCoord:{lat:z.lat,lng:z.lng},getCurrentLocation:Z,onMapCenterChange:e=>{B(e)},interactiveMapPinIconUrl:c,mapPanZoom:d})]}):e.jsx(Y,{id:o,cachedImage:s,refreshNetwork:()=>{try{navigator.onLine&&H(!0)}catch(e){}}})})}),(()=>{if(P&&i)return F?e.jsx(r.Prompt,{id:r.TestHelper.generateId(o,"onemap-error"),"data-testid":r.TestHelper.generateId(o,"onemap-error"),title:"Map not available",size:"large",show:!0,image:e.jsx(b,{src:"https://assets.life.gov.sg/web-frontend-engine/img/common/error.svg"}),description:e.jsxs(r.Description,{weight:"regular",children:["Sorry, there was a problem with the map. You’ll not be able to enter the location right now. Please try again later.",e.jsx("br",{}),e.jsx("br",{}),"Do note that you’ll not be able to submit your report without entering the location."]}),buttons:[{id:"ok",title:"OK",onClick:()=>{O(!1),q()}}]}):N?e.jsx(r.Prompt,{id:r.TestHelper.generateId(o,"get-location-error"),"data-testid":r.TestHelper.generateId(o,"get-location-error"),title:"Enable location settings",size:"large",show:!0,description:"We need your permission to determine your location. Enable location access in your browser and device settings, or enter your location manually.",buttons:[{id:"ok",title:"OK",onClick:V}]}):W?e.jsx(r.Prompt,{id:r.TestHelper.generateId(o,"get-location-timeout-error"),"data-testid":r.TestHelper.generateId(o,"get-location-timeout-error"),title:"Something went wrong",size:"large",show:!0,image:e.jsx(b,{src:"https://assets.life.gov.sg/web-frontend-engine/img/icons/get-location-timeout.svg"}),description:e.jsx(r.Description,{weight:"regular",children:"It’s taking longer than expected to retrieve your location. Please exit the map and try again."}),buttons:[{id:"ok",title:"OK",onClick:()=>{R(!1),q()}}]}):void 0})()]})};
//# sourceMappingURL=location-modal.6c11738e.js.map
