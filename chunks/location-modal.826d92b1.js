import{jsxs as t,jsx as e,Fragment as n}from"react/jsx-runtime";import{MediaWidths as r,MediaQuery as o,Color as a,Text as l,Button as i,Modal as s}from"@lifesg/react-design-system";import{l as d,f as c,L as p,T as f,H as g,d as m,i as u,b as h,O as b,e as x,G as v,g as y,S as w,P as k,h as z,J as M,j as L,D as $}from"./index.97ae3916.js";import{useRef as C,useEffect as I,useState as T,useCallback as E}from"react";import"react-dom/server";import P,{keyframes as S}from"styled-components";import{CrossIcon as N}from"@lifesg/react-icons/cross";import"events";import"buffer";import"react-dom";import"@lifesg/react-icons/pin-fill";const A="https://assets.life.gov.sg/web-frontend-engine/img/common/no-network.png";!function(t,e){void 0===e&&(e={});var n=e.insertAt;if(t&&"undefined"!=typeof document){var r=document.head||document.getElementsByTagName("head")[0],o=document.createElement("style");o.type="text/css","top"===n&&r.firstChild?r.insertBefore(o,r.firstChild):r.appendChild(o),o.styleSheet?o.styleSheet.cssText=t:o.appendChild(document.createTextNode(t))}}('/* required styles */\r\n\r\n.leaflet-pane,\r\n.leaflet-tile,\r\n.leaflet-marker-icon,\r\n.leaflet-marker-shadow,\r\n.leaflet-tile-container,\r\n.leaflet-pane > svg,\r\n.leaflet-pane > canvas,\r\n.leaflet-zoom-box,\r\n.leaflet-image-layer,\r\n.leaflet-layer {\r\n\tposition: absolute;\r\n\tleft: 0;\r\n\ttop: 0;\r\n\t}\r\n.leaflet-container {\r\n\toverflow: hidden;\r\n\t}\r\n.leaflet-tile,\r\n.leaflet-marker-icon,\r\n.leaflet-marker-shadow {\r\n\t-webkit-user-select: none;\r\n\t   -moz-user-select: none;\r\n\t        user-select: none;\r\n\t  -webkit-user-drag: none;\r\n\t}\r\n/* Prevents IE11 from highlighting tiles in blue */\r\n.leaflet-tile::selection {\r\n\tbackground: transparent;\r\n}\r\n/* Safari renders non-retina tile on retina better with this, but Chrome is worse */\r\n.leaflet-safari .leaflet-tile {\r\n\timage-rendering: -webkit-optimize-contrast;\r\n\t}\r\n/* hack that prevents hw layers "stretching" when loading new tiles */\r\n.leaflet-safari .leaflet-tile-container {\r\n\twidth: 1600px;\r\n\theight: 1600px;\r\n\t-webkit-transform-origin: 0 0;\r\n\t}\r\n.leaflet-marker-icon,\r\n.leaflet-marker-shadow {\r\n\tdisplay: block;\r\n\t}\r\n/* .leaflet-container svg: reset svg max-width decleration shipped in Joomla! (joomla.org) 3.x */\r\n/* .leaflet-container img: map is broken in FF if you have max-width: 100% on tiles */\r\n.leaflet-container .leaflet-overlay-pane svg {\r\n\tmax-width: none !important;\r\n\tmax-height: none !important;\r\n\t}\r\n.leaflet-container .leaflet-marker-pane img,\r\n.leaflet-container .leaflet-shadow-pane img,\r\n.leaflet-container .leaflet-tile-pane img,\r\n.leaflet-container img.leaflet-image-layer,\r\n.leaflet-container .leaflet-tile {\r\n\tmax-width: none !important;\r\n\tmax-height: none !important;\r\n\twidth: auto;\r\n\tpadding: 0;\r\n\t}\r\n\r\n.leaflet-container img.leaflet-tile {\r\n\t/* See: https://bugs.chromium.org/p/chromium/issues/detail?id=600120 */\r\n\tmix-blend-mode: plus-lighter;\r\n}\r\n\r\n.leaflet-container.leaflet-touch-zoom {\r\n\t-ms-touch-action: pan-x pan-y;\r\n\ttouch-action: pan-x pan-y;\r\n\t}\r\n.leaflet-container.leaflet-touch-drag {\r\n\t-ms-touch-action: pinch-zoom;\r\n\t/* Fallback for FF which doesn\'t support pinch-zoom */\r\n\ttouch-action: none;\r\n\ttouch-action: pinch-zoom;\r\n}\r\n.leaflet-container.leaflet-touch-drag.leaflet-touch-zoom {\r\n\t-ms-touch-action: none;\r\n\ttouch-action: none;\r\n}\r\n.leaflet-container {\r\n\t-webkit-tap-highlight-color: transparent;\r\n}\r\n.leaflet-container a {\r\n\t-webkit-tap-highlight-color: rgba(51, 181, 229, 0.4);\r\n}\r\n.leaflet-tile {\r\n\tfilter: inherit;\r\n\tvisibility: hidden;\r\n\t}\r\n.leaflet-tile-loaded {\r\n\tvisibility: inherit;\r\n\t}\r\n.leaflet-zoom-box {\r\n\twidth: 0;\r\n\theight: 0;\r\n\t-moz-box-sizing: border-box;\r\n\t     box-sizing: border-box;\r\n\tz-index: 800;\r\n\t}\r\n/* workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=888319 */\r\n.leaflet-overlay-pane svg {\r\n\t-moz-user-select: none;\r\n\t}\r\n\r\n.leaflet-pane         { z-index: 400; }\r\n\r\n.leaflet-tile-pane    { z-index: 200; }\r\n.leaflet-overlay-pane { z-index: 400; }\r\n.leaflet-shadow-pane  { z-index: 500; }\r\n.leaflet-marker-pane  { z-index: 600; }\r\n.leaflet-tooltip-pane   { z-index: 650; }\r\n.leaflet-popup-pane   { z-index: 700; }\r\n\r\n.leaflet-map-pane canvas { z-index: 100; }\r\n.leaflet-map-pane svg    { z-index: 200; }\r\n\r\n.leaflet-vml-shape {\r\n\twidth: 1px;\r\n\theight: 1px;\r\n\t}\r\n.lvml {\r\n\tbehavior: url(#default#VML);\r\n\tdisplay: inline-block;\r\n\tposition: absolute;\r\n\t}\r\n\r\n\r\n/* control positioning */\r\n\r\n.leaflet-control {\r\n\tposition: relative;\r\n\tz-index: 800;\r\n\tpointer-events: visiblePainted; /* IE 9-10 doesn\'t have auto */\r\n\tpointer-events: auto;\r\n\t}\r\n.leaflet-top,\r\n.leaflet-bottom {\r\n\tposition: absolute;\r\n\tz-index: 1000;\r\n\tpointer-events: none;\r\n\t}\r\n.leaflet-top {\r\n\ttop: 0;\r\n\t}\r\n.leaflet-right {\r\n\tright: 0;\r\n\t}\r\n.leaflet-bottom {\r\n\tbottom: 0;\r\n\t}\r\n.leaflet-left {\r\n\tleft: 0;\r\n\t}\r\n.leaflet-control {\r\n\tfloat: left;\r\n\tclear: both;\r\n\t}\r\n.leaflet-right .leaflet-control {\r\n\tfloat: right;\r\n\t}\r\n.leaflet-top .leaflet-control {\r\n\tmargin-top: 10px;\r\n\t}\r\n.leaflet-bottom .leaflet-control {\r\n\tmargin-bottom: 10px;\r\n\t}\r\n.leaflet-left .leaflet-control {\r\n\tmargin-left: 10px;\r\n\t}\r\n.leaflet-right .leaflet-control {\r\n\tmargin-right: 10px;\r\n\t}\r\n\r\n\r\n/* zoom and fade animations */\r\n\r\n.leaflet-fade-anim .leaflet-popup {\r\n\topacity: 0;\r\n\t-webkit-transition: opacity 0.2s linear;\r\n\t   -moz-transition: opacity 0.2s linear;\r\n\t        transition: opacity 0.2s linear;\r\n\t}\r\n.leaflet-fade-anim .leaflet-map-pane .leaflet-popup {\r\n\topacity: 1;\r\n\t}\r\n.leaflet-zoom-animated {\r\n\t-webkit-transform-origin: 0 0;\r\n\t    -ms-transform-origin: 0 0;\r\n\t        transform-origin: 0 0;\r\n\t}\r\nsvg.leaflet-zoom-animated {\r\n\twill-change: transform;\r\n}\r\n\r\n.leaflet-zoom-anim .leaflet-zoom-animated {\r\n\t-webkit-transition: -webkit-transform 0.25s cubic-bezier(0,0,0.25,1);\r\n\t   -moz-transition:    -moz-transform 0.25s cubic-bezier(0,0,0.25,1);\r\n\t        transition:         transform 0.25s cubic-bezier(0,0,0.25,1);\r\n\t}\r\n.leaflet-zoom-anim .leaflet-tile,\r\n.leaflet-pan-anim .leaflet-tile {\r\n\t-webkit-transition: none;\r\n\t   -moz-transition: none;\r\n\t        transition: none;\r\n\t}\r\n\r\n.leaflet-zoom-anim .leaflet-zoom-hide {\r\n\tvisibility: hidden;\r\n\t}\r\n\r\n\r\n/* cursors */\r\n\r\n.leaflet-interactive {\r\n\tcursor: pointer;\r\n\t}\r\n.leaflet-grab {\r\n\tcursor: -webkit-grab;\r\n\tcursor:    -moz-grab;\r\n\tcursor:         grab;\r\n\t}\r\n.leaflet-crosshair,\r\n.leaflet-crosshair .leaflet-interactive {\r\n\tcursor: crosshair;\r\n\t}\r\n.leaflet-popup-pane,\r\n.leaflet-control {\r\n\tcursor: auto;\r\n\t}\r\n.leaflet-dragging .leaflet-grab,\r\n.leaflet-dragging .leaflet-grab .leaflet-interactive,\r\n.leaflet-dragging .leaflet-marker-draggable {\r\n\tcursor: move;\r\n\tcursor: -webkit-grabbing;\r\n\tcursor:    -moz-grabbing;\r\n\tcursor:         grabbing;\r\n\t}\r\n\r\n/* marker & overlays interactivity */\r\n.leaflet-marker-icon,\r\n.leaflet-marker-shadow,\r\n.leaflet-image-layer,\r\n.leaflet-pane > svg path,\r\n.leaflet-tile-container {\r\n\tpointer-events: none;\r\n\t}\r\n\r\n.leaflet-marker-icon.leaflet-interactive,\r\n.leaflet-image-layer.leaflet-interactive,\r\n.leaflet-pane > svg path.leaflet-interactive,\r\nsvg.leaflet-image-layer.leaflet-interactive path {\r\n\tpointer-events: visiblePainted; /* IE 9-10 doesn\'t have auto */\r\n\tpointer-events: auto;\r\n\t}\r\n\r\n/* visual tweaks */\r\n\r\n.leaflet-container {\r\n\tbackground: #ddd;\r\n\toutline-offset: 1px;\r\n\t}\r\n.leaflet-container a {\r\n\tcolor: #0078A8;\r\n\t}\r\n.leaflet-zoom-box {\r\n\tborder: 2px dotted #38f;\r\n\tbackground: rgba(255,255,255,0.5);\r\n\t}\r\n\r\n\r\n/* general typography */\r\n.leaflet-container {\r\n\tfont-family: "Helvetica Neue", Arial, Helvetica, sans-serif;\r\n\tfont-size: 12px;\r\n\tfont-size: 0.75rem;\r\n\tline-height: 1.5;\r\n\t}\r\n\r\n\r\n/* general toolbar styles */\r\n\r\n.leaflet-bar {\r\n\tbox-shadow: 0 1px 5px rgba(0,0,0,0.65);\r\n\tborder-radius: 4px;\r\n\t}\r\n.leaflet-bar a {\r\n\tbackground-color: #fff;\r\n\tborder-bottom: 1px solid #ccc;\r\n\twidth: 26px;\r\n\theight: 26px;\r\n\tline-height: 26px;\r\n\tdisplay: block;\r\n\ttext-align: center;\r\n\ttext-decoration: none;\r\n\tcolor: black;\r\n\t}\r\n.leaflet-bar a,\r\n.leaflet-control-layers-toggle {\r\n\tbackground-position: 50% 50%;\r\n\tbackground-repeat: no-repeat;\r\n\tdisplay: block;\r\n\t}\r\n.leaflet-bar a:hover,\r\n.leaflet-bar a:focus {\r\n\tbackground-color: #f4f4f4;\r\n\t}\r\n.leaflet-bar a:first-child {\r\n\tborder-top-left-radius: 4px;\r\n\tborder-top-right-radius: 4px;\r\n\t}\r\n.leaflet-bar a:last-child {\r\n\tborder-bottom-left-radius: 4px;\r\n\tborder-bottom-right-radius: 4px;\r\n\tborder-bottom: none;\r\n\t}\r\n.leaflet-bar a.leaflet-disabled {\r\n\tcursor: default;\r\n\tbackground-color: #f4f4f4;\r\n\tcolor: #bbb;\r\n\t}\r\n\r\n.leaflet-touch .leaflet-bar a {\r\n\twidth: 30px;\r\n\theight: 30px;\r\n\tline-height: 30px;\r\n\t}\r\n.leaflet-touch .leaflet-bar a:first-child {\r\n\tborder-top-left-radius: 2px;\r\n\tborder-top-right-radius: 2px;\r\n\t}\r\n.leaflet-touch .leaflet-bar a:last-child {\r\n\tborder-bottom-left-radius: 2px;\r\n\tborder-bottom-right-radius: 2px;\r\n\t}\r\n\r\n/* zoom control */\r\n\r\n.leaflet-control-zoom-in,\r\n.leaflet-control-zoom-out {\r\n\tfont: bold 18px \'Lucida Console\', Monaco, monospace;\r\n\ttext-indent: 1px;\r\n\t}\r\n\r\n.leaflet-touch .leaflet-control-zoom-in, .leaflet-touch .leaflet-control-zoom-out  {\r\n\tfont-size: 22px;\r\n\t}\r\n\r\n\r\n/* layers control */\r\n\r\n.leaflet-control-layers {\r\n\tbox-shadow: 0 1px 5px rgba(0,0,0,0.4);\r\n\tbackground: #fff;\r\n\tborder-radius: 5px;\r\n\t}\r\n.leaflet-control-layers-toggle {\r\n\tbackground-image: url(images/layers.png);\r\n\twidth: 36px;\r\n\theight: 36px;\r\n\t}\r\n.leaflet-retina .leaflet-control-layers-toggle {\r\n\tbackground-image: url(images/layers-2x.png);\r\n\tbackground-size: 26px 26px;\r\n\t}\r\n.leaflet-touch .leaflet-control-layers-toggle {\r\n\twidth: 44px;\r\n\theight: 44px;\r\n\t}\r\n.leaflet-control-layers .leaflet-control-layers-list,\r\n.leaflet-control-layers-expanded .leaflet-control-layers-toggle {\r\n\tdisplay: none;\r\n\t}\r\n.leaflet-control-layers-expanded .leaflet-control-layers-list {\r\n\tdisplay: block;\r\n\tposition: relative;\r\n\t}\r\n.leaflet-control-layers-expanded {\r\n\tpadding: 6px 10px 6px 6px;\r\n\tcolor: #333;\r\n\tbackground: #fff;\r\n\t}\r\n.leaflet-control-layers-scrollbar {\r\n\toverflow-y: scroll;\r\n\toverflow-x: hidden;\r\n\tpadding-right: 5px;\r\n\t}\r\n.leaflet-control-layers-selector {\r\n\tmargin-top: 2px;\r\n\tposition: relative;\r\n\ttop: 1px;\r\n\t}\r\n.leaflet-control-layers label {\r\n\tdisplay: block;\r\n\tfont-size: 13px;\r\n\tfont-size: 1.08333em;\r\n\t}\r\n.leaflet-control-layers-separator {\r\n\theight: 0;\r\n\tborder-top: 1px solid #ddd;\r\n\tmargin: 5px -10px 5px -6px;\r\n\t}\r\n\r\n/* Default icon URLs */\r\n.leaflet-default-icon-path { /* used only in path-guessing heuristic, see L.Icon.Default */\r\n\tbackground-image: url(images/marker-icon.png);\r\n\t}\r\n\r\n\r\n/* attribution and scale controls */\r\n\r\n.leaflet-container .leaflet-control-attribution {\r\n\tbackground: #fff;\r\n\tbackground: rgba(255, 255, 255, 0.8);\r\n\tmargin: 0;\r\n\t}\r\n.leaflet-control-attribution,\r\n.leaflet-control-scale-line {\r\n\tpadding: 0 5px;\r\n\tcolor: #333;\r\n\tline-height: 1.4;\r\n\t}\r\n.leaflet-control-attribution a {\r\n\ttext-decoration: none;\r\n\t}\r\n.leaflet-control-attribution a:hover,\r\n.leaflet-control-attribution a:focus {\r\n\ttext-decoration: underline;\r\n\t}\r\n.leaflet-attribution-flag {\r\n\tdisplay: inline !important;\r\n\tvertical-align: baseline !important;\r\n\twidth: 1em;\r\n\theight: 0.6669em;\r\n\t}\r\n.leaflet-left .leaflet-control-scale {\r\n\tmargin-left: 5px;\r\n\t}\r\n.leaflet-bottom .leaflet-control-scale {\r\n\tmargin-bottom: 5px;\r\n\t}\r\n.leaflet-control-scale-line {\r\n\tborder: 2px solid #777;\r\n\tborder-top: none;\r\n\tline-height: 1.1;\r\n\tpadding: 2px 5px 1px;\r\n\twhite-space: nowrap;\r\n\t-moz-box-sizing: border-box;\r\n\t     box-sizing: border-box;\r\n\tbackground: rgba(255, 255, 255, 0.8);\r\n\ttext-shadow: 1px 1px #fff;\r\n\t}\r\n.leaflet-control-scale-line:not(:first-child) {\r\n\tborder-top: 2px solid #777;\r\n\tborder-bottom: none;\r\n\tmargin-top: -2px;\r\n\t}\r\n.leaflet-control-scale-line:not(:first-child):not(:last-child) {\r\n\tborder-bottom: 2px solid #777;\r\n\t}\r\n\r\n.leaflet-touch .leaflet-control-attribution,\r\n.leaflet-touch .leaflet-control-layers,\r\n.leaflet-touch .leaflet-bar {\r\n\tbox-shadow: none;\r\n\t}\r\n.leaflet-touch .leaflet-control-layers,\r\n.leaflet-touch .leaflet-bar {\r\n\tborder: 2px solid rgba(0,0,0,0.2);\r\n\tbackground-clip: padding-box;\r\n\t}\r\n\r\n\r\n/* popup */\r\n\r\n.leaflet-popup {\r\n\tposition: absolute;\r\n\ttext-align: center;\r\n\tmargin-bottom: 20px;\r\n\t}\r\n.leaflet-popup-content-wrapper {\r\n\tpadding: 1px;\r\n\ttext-align: left;\r\n\tborder-radius: 12px;\r\n\t}\r\n.leaflet-popup-content {\r\n\tmargin: 13px 24px 13px 20px;\r\n\tline-height: 1.3;\r\n\tfont-size: 13px;\r\n\tfont-size: 1.08333em;\r\n\tmin-height: 1px;\r\n\t}\r\n.leaflet-popup-content p {\r\n\tmargin: 17px 0;\r\n\tmargin: 1.3em 0;\r\n\t}\r\n.leaflet-popup-tip-container {\r\n\twidth: 40px;\r\n\theight: 20px;\r\n\tposition: absolute;\r\n\tleft: 50%;\r\n\tmargin-top: -1px;\r\n\tmargin-left: -20px;\r\n\toverflow: hidden;\r\n\tpointer-events: none;\r\n\t}\r\n.leaflet-popup-tip {\r\n\twidth: 17px;\r\n\theight: 17px;\r\n\tpadding: 1px;\r\n\r\n\tmargin: -10px auto 0;\r\n\tpointer-events: auto;\r\n\r\n\t-webkit-transform: rotate(45deg);\r\n\t   -moz-transform: rotate(45deg);\r\n\t    -ms-transform: rotate(45deg);\r\n\t        transform: rotate(45deg);\r\n\t}\r\n.leaflet-popup-content-wrapper,\r\n.leaflet-popup-tip {\r\n\tbackground: white;\r\n\tcolor: #333;\r\n\tbox-shadow: 0 3px 14px rgba(0,0,0,0.4);\r\n\t}\r\n.leaflet-container a.leaflet-popup-close-button {\r\n\tposition: absolute;\r\n\ttop: 0;\r\n\tright: 0;\r\n\tborder: none;\r\n\ttext-align: center;\r\n\twidth: 24px;\r\n\theight: 24px;\r\n\tfont: 16px/24px Tahoma, Verdana, sans-serif;\r\n\tcolor: #757575;\r\n\ttext-decoration: none;\r\n\tbackground: transparent;\r\n\t}\r\n.leaflet-container a.leaflet-popup-close-button:hover,\r\n.leaflet-container a.leaflet-popup-close-button:focus {\r\n\tcolor: #585858;\r\n\t}\r\n.leaflet-popup-scrolled {\r\n\toverflow: auto;\r\n\t}\r\n\r\n.leaflet-oldie .leaflet-popup-content-wrapper {\r\n\t-ms-zoom: 1;\r\n\t}\r\n.leaflet-oldie .leaflet-popup-tip {\r\n\twidth: 24px;\r\n\tmargin: 0 auto;\r\n\r\n\t-ms-filter: "progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)";\r\n\tfilter: progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678);\r\n\t}\r\n\r\n.leaflet-oldie .leaflet-control-zoom,\r\n.leaflet-oldie .leaflet-control-layers,\r\n.leaflet-oldie .leaflet-popup-content-wrapper,\r\n.leaflet-oldie .leaflet-popup-tip {\r\n\tborder: 1px solid #999;\r\n\t}\r\n\r\n\r\n/* div icon */\r\n\r\n.leaflet-div-icon {\r\n\tbackground: #fff;\r\n\tborder: 1px solid #666;\r\n\t}\r\n\r\n\r\n/* Tooltip */\r\n/* Base styles for the element that has a tooltip */\r\n.leaflet-tooltip {\r\n\tposition: absolute;\r\n\tpadding: 6px;\r\n\tbackground-color: #fff;\r\n\tborder: 1px solid #fff;\r\n\tborder-radius: 3px;\r\n\tcolor: #222;\r\n\twhite-space: nowrap;\r\n\t-webkit-user-select: none;\r\n\t-moz-user-select: none;\r\n\t-ms-user-select: none;\r\n\tuser-select: none;\r\n\tpointer-events: none;\r\n\tbox-shadow: 0 1px 3px rgba(0,0,0,0.4);\r\n\t}\r\n.leaflet-tooltip.leaflet-interactive {\r\n\tcursor: pointer;\r\n\tpointer-events: auto;\r\n\t}\r\n.leaflet-tooltip-top:before,\r\n.leaflet-tooltip-bottom:before,\r\n.leaflet-tooltip-left:before,\r\n.leaflet-tooltip-right:before {\r\n\tposition: absolute;\r\n\tpointer-events: none;\r\n\tborder: 6px solid transparent;\r\n\tbackground: transparent;\r\n\tcontent: "";\r\n\t}\r\n\r\n/* Directions */\r\n\r\n.leaflet-tooltip-bottom {\r\n\tmargin-top: 6px;\r\n}\r\n.leaflet-tooltip-top {\r\n\tmargin-top: -6px;\r\n}\r\n.leaflet-tooltip-bottom:before,\r\n.leaflet-tooltip-top:before {\r\n\tleft: 50%;\r\n\tmargin-left: -6px;\r\n\t}\r\n.leaflet-tooltip-top:before {\r\n\tbottom: 0;\r\n\tmargin-bottom: -12px;\r\n\tborder-top-color: #fff;\r\n\t}\r\n.leaflet-tooltip-bottom:before {\r\n\ttop: 0;\r\n\tmargin-top: -12px;\r\n\tmargin-left: -6px;\r\n\tborder-bottom-color: #fff;\r\n\t}\r\n.leaflet-tooltip-left {\r\n\tmargin-left: -6px;\r\n}\r\n.leaflet-tooltip-right {\r\n\tmargin-left: 6px;\r\n}\r\n.leaflet-tooltip-left:before,\r\n.leaflet-tooltip-right:before {\r\n\ttop: 50%;\r\n\tmargin-top: -6px;\r\n\t}\r\n.leaflet-tooltip-left:before {\r\n\tright: 0;\r\n\tmargin-right: -12px;\r\n\tborder-left-color: #fff;\r\n\t}\r\n.leaflet-tooltip-right:before {\r\n\tleft: 0;\r\n\tmargin-left: -12px;\r\n\tborder-right-color: #fff;\r\n\t}\r\n\r\n/* Printing */\r\n\r\n@media print {\r\n\t/* Prevent printers from removing background-images of controls. */\r\n\t.leaflet-control {\r\n\t\t-webkit-print-color-adjust: exact;\r\n\t\tprint-color-adjust: exact;\r\n\t\t}\r\n\t}\r\n');const F=({lat:t,lng:e},n,r)=>{const o=r?44:32;return d.exports.marker([t,e],{icon:d.exports.icon({iconUrl:n,iconSize:[o,o],iconAnchor:[o/2,o]})})},O=t=>{t&&t.forEach((t=>t.remove()))},G=P.div`
	position: relative;
`,V=P.div`
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
				box-shadow: 0 0.125rem 0.25rem ${c.Neutral[1]}66;
			}

			&.leaflet-bar a {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				height: 50%;
				color: ${c.Primary};
				font-weight: bold;

				&.leaflet-control-zoom-in {
					border-bottom-color: ${c.Neutral[5]};
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
`,W=P.button`
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
	background: ${c.Neutral[8]};
	cursor: pointer;
	box-shadow: 0 0.125rem 0.25rem ${c.Neutral[1]}66;
`,j=P.img`
	width: 1.5rem;
	height: 1.5rem;
`,B=P(g.Box)`
	flex-direction: row;
	width: 70%;
	max-width: 45rem;
	height: 40rem;

	// set z-index to get past safari border-radius issue
	z-index: 1;

	${({locationModalStyles:t})=>{if(t)return`${t}`}}

	${m.MaxWidth.tablet} {
		flex-direction: column;
		height: 90%;
		max-height: 90%;
	}

	${m.MaxWidth.mobileL}, (orientation: landscape) and (max-height: ${u.mobileL}px) {
		height: 100%;
		width: 100%;
		flex-direction: column;
		max-width: none;
		max-height: none;
		border-radius: 0;
	}
`,D=P((({id:n="location-picker",className:o,mapPanZoom:a,panelInputMode:l,showLocationModal:i,selectedLocationCoord:s,interactiveMapPinIconUrl:c="https://assets.life.gov.sg/web-frontend-engine/img/icons/location-pin-blue.svg",getCurrentLocation:g,locationAvailable:m,gettingCurrentLocation:u,onMapCenterChange:h})=>{const b=C(),x=C(null),v=C(),y=window.matchMedia(`(max-width: ${r.tablet}px)`).matches,w=11;I((()=>{if(x.current&&i){b.current||(b.current=d.exports.map(x.current,{zoomControl:!1}),k(),d.exports.control.zoom({position:"bottomright"}).addTo(b.current));const t=d.exports.tileLayer("https://maps-{s}.onemap.sg/v3/Default/{z}/{x}/{y}.png",{detectRetina:!0,maxNativeZoom:18,maxZoom:y?20:19,minZoom:w,attribution:'<div class="onemap"><img src="https://www.onemap.gov.sg/docs/maps/images/oneMap64-01.png" style="height:20px;width:20px;"/> OneMap | Map data &copy; contributors, <a href="http://SLA.gov.sg">Singapore Land Authority</a></div>'});b.current.setMaxBounds(p.getMapBounds()),t.addTo(b.current),!u&&s?.lat&&s?.lng&&z({lat:s.lat,lng:s.lng});const e=b.current;e.on("click",(({latlng:t})=>{u||h(t)})),e.on("zoomend",(()=>e.setMinZoom(a?.min??w)))}else b.current&&(b.current?.off(),b.current?.remove(),b.current=void 0)}),[i]),I((()=>{s?.lat&&s?.lng?z(s):k()}),[s?.lat,s?.lng]);const k=()=>{if(b.current){O(v.current);const t=d.exports.bounds([1.56073,104.11475],[1.16,103.502]).getCenter();b.current.setView([t.x,t.y],12),setTimeout((()=>b.current?.invalidateSize()),500)}},z=t=>{const e=b.current;if(!e)return;O(v.current),v.current=[F(t,c).addTo(e)];const n=Math.max(a?.min??w,y?a?.mobile??18:a?.nonMobile??17),r=e.getBounds().contains([t.lat,t.lng])&&e.getZoom()>n?e.getZoom():n;e.flyTo(d.exports.latLng(t.lat,t.lng),r),setTimeout((()=>e.invalidateSize()),500)};return t(G,{className:o,id:f.generateId(n,"location-picker"),"data-testid":f.generateId(n,"location-picker","search"===l?"hide":"show"),children:[e(V,{ref:x}),e(W,{onClick:()=>{m&&g()},children:e(j,{src:m?"https://assets.life.gov.sg/web-frontend-engine/img/icons/current-location.svg":"https://assets.life.gov.sg/web-frontend-engine/img/icons/current-location-unavailable.svg",alt:"Current location "+(m?"available":"unavailable")})})]})}))`
	width: 48.89%;

	${m.MaxWidth.tablet}, (orientation: landscape) and (max-height: ${u.mobileL}px) {
		display: ${({panelInputMode:t})=>"map"!==t?"none":"block"};
		position: relative;
		left: 0;
		width: 100%;
		margin-top: 1rem;
		height: calc(100% - 13rem);
	}
`,R=P.img`
	display: block;
	margin: 0 auto 2rem;
	width: 10.5rem;
	height: 8rem;

	${m.MaxWidth.mobileL} {
		margin-top: 2.5rem;
	}
`,Z=P.img`
	display: none;
`;function H(){var t=new Map;return{getObserver:function(e){var n=e.root,r=e.rootMargin,o=e.threshold,a=t.get(n);a||(a=new Map,t.set(n,a));var l=JSON.stringify({rootMargin:r,threshold:o}),i=a.get(l);if(!i){var s=new Map,d=new IntersectionObserver((function(t){t.forEach((function(t){var e=s.get(t.target);null==e||e(t)}))}),{root:n,rootMargin:r,threshold:o});i={observer:d,entryCallbacks:s},a.set(l,i)}return{observe:function(t,e){var n,r;null==(n=i)||n.entryCallbacks.set(t,e),null==(r=i)||r.observer.observe(t)},unobserve:function(t){var e,n;null==(e=i)||e.entryCallbacks.delete(t),null==(n=i)||n.observer.unobserve(t)}}}}}var U="0px",_=[0],q=H();function K(){return K=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},K.apply(this,arguments)}function J(t){var e,n=function(t){var e,n,r=null!=(e=null==t?void 0:t.rootMargin)?e:U,o=null!=(n=null==t?void 0:t.threshold)?n:_,a=C(null),l=C(null),i=C(null),s=T(),d=s[0],c=s[1],p=E((function(){var t=a.current;if(t){var e=q.getObserver({root:l.current,rootMargin:r,threshold:o});e.observe(t,(function(t){c(t)})),i.current=e}else c(void 0)}),[r,o]),f=E((function(){var t=i.current,e=a.current;e&&(null==t||t.unobserve(e)),i.current=null}),[]);return[E((function(t){f(),a.current=t,p()}),[p,f]),{entry:d,rootRef:E((function(t){f(),l.current=t,p()}),[p,f])}]}(t),r=n[0],o=n[1],a=Boolean(null==(e=o.entry)?void 0:e.isIntersecting),l=T(a),i=l[0],s=l[1];return a&&!i&&s(!0),[r,K({},o,{isVisible:a,wasEverVisible:i})]}const X=P.div`
	padding: 0.5rem;
	text-align: center;
`,Y=P.div`
	display: inline-block;
	position: relative;
	width: ${1.5}rem;
	height: ${1.5}rem;
`,Q=S`
  0% {
	background-color: #8e8e93;
  }
  100% {
	background-color: #EEE;
  }
`,tt=P.div`
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
		animation: ${Q} ${.8}s linear infinite;
	}

	${Array(8).fill("").map(((t,e)=>`\n\t\t\t\t&:nth-child(${e+1}) {\n\t\t\t\t\ttransform: rotate(${360*e/8}deg);\n\t\t\t\t}\n\n\t\t\t\t&:nth-child(${e+1})::after {\n\t\t\t\t\tanimation-delay: -${(8-e)/10}s;\n\t\t\t\t}\n\t\t\t`))}
`,et=t=>e(Y,{...t,children:Array(8).fill("").map(((t,n)=>e(tt,{},n)))}),nt=r=>{const{loading:o,items:a,hasNextPage:l,error:i,loadMore:s,rootMargin:d="0px 0px 50px 0px"}=r,[c]=function(t){var e=t.loading,n=t.hasNextPage,r=t.onLoadMore,o=t.rootMargin,a=t.disabled,l=t.delayInMs,i=void 0===l?100:l,s=J({rootMargin:o}),d=s[0],c=s[1],p=c.rootRef,f=c.isVisible,g=!a&&!e&&f&&n;return I((function(){if(g){var t=setTimeout((function(){r()}),i);return function(){clearTimeout(t)}}}),[r,g,i]),[d,{rootRef:p}]}({loading:o,hasNextPage:l,onLoadMore:s,disabled:!!i,rootMargin:d});return t(n,{children:[a,(o||l)&&e(X,{"data-testid":"InfiniteScrollList__InfiniteListItem-sentryRef",ref:c,children:e(et,{})})]})},rt=(t,e,n)=>t.slice((n-1)*e,n*e),ot=(t,e)=>{const n=new RegExp(e,"gi");return t.map((t=>{const r=(t.displayAddressText||t.address).replace(n,`<span class="keyword">${e}</span>`);return{...t,displayAddressText:r}}))},at=P.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	padding: 2rem 1.5rem 1rem;

	${o.MaxWidth.tablet}, (orientation: landscape) and (max-height: ${r.mobileL}px) {
		flex: unset;
		height: ${({panelInputMode:t})=>"search"===t?"100%":"auto"};
		padding: 1.5rem 1.25rem 0;
	}
`,lt=P.div`
	position: relative;
	display: flex;
	gap: 0.5rem;
	padding-bottom: 0.4rem;
	alight-items: center;
	justify-content: space-between;
	border-bottom: 1px solid ${a.Neutral[5]};
	clip-path: inset(0 0 -0.3rem 0);
	transition: box-shadow 0.3s linear;

	${({hasScrolled:t})=>t?"box-shadow: 0 0.06rem 0.4rem rgba(0,0,0,.12);":""}

	&:focus-within {
		border-bottom: 1px solid ${a.Accent.Light[1]};
	}

	${o.MaxWidth.tablet}, (orientation: landscape) and (max-height: ${r.mobileL}px) {
		margin: 0.8rem 0 0;
	}
`,it=P.button`
	display: flex;
	width: fit-content;
	align-items: center;
	background: none;
	border: none;
	padding: 0;
	margin: 0;
	cursor: pointer;
`,st=P.img`
	width: 1rem;
	height: auto;
`,dt=P.input`
	border: none;
	width: 100%;
	margin: 0;
	padding: 0;
	font-size: 1rem;
	outline: none;

	::placeholder,
	::-webkit-input-placeholder {
		color: ${a.Neutral[4]};
	}
`,ct=P(N)`
	display: none;
	font-size: 1.5rem;
	color: ${a.Primary};

	${o.MaxWidth.tablet}, (orientation: landscape) and (max-height: ${r.mobileL}px) {
		display: block;
		margin: -0.4rem 0 0 -0.4rem;
	}
`,pt=P(N)`
	font-size: 1.7rem;
	color: ${a.Neutral[4]};
`,ft=P.div`
	overflow-y: auto;
	flex: 1;
	border-bottom: solid 1px ${a.Neutral[5]};

	${o.MaxWidth.tablet}, (orientation: landscape) and (max-height: ${r.mobileL}px) {
		display: ${({panelInputMode:t})=>"map"!==t?"block":"none"};
		border-bottom: 0;
	}
`,gt=P(l.H5)`
	border-bottom: 1px solid ${a.Neutral[5]};
	padding: 1rem 0;
`,mt=P(l.BodySmall)`
	padding-top: 1rem;
	color: ${a.Neutral[4]};
	word-break: break-all;
	overflow-y: scroll;
`,ut=P.div`
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 1rem 1rem 1rem 0;
	border-bottom: 1px solid ${a.Neutral[5]};
	text-transform: uppercase;
	cursor: pointer;
	background-color: ${({active:t})=>t?a.Accent.Light[5]:"transparent"};

	.keyword {
		font-family: "Open Sans Semibold";
	}
`,ht=P.img`
	width: 1rem;
`,bt=P.div`
	display: flex;
	justify-content: center;
	gap: 1rem;
	padding-top: 1rem;

	${o.MaxWidth.tablet}, (orientation: landscape) and (max-height: ${r.mobileL}px) {
		display: ${({panelInputMode:t})=>"map"===t?"block":"none"};
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		padding: 1.5rem 1.25rem 1.93rem;
	}
`,xt=P(i.Default)`
	width: 9.5rem;

	${o.MaxWidth.tablet}, (orientation: landscape) and (max-height: ${r.mobileL}px) {
		${({buttonType:t})=>"cancel"===t&&"display: none"}
		${({buttonType:t})=>"confirm"===t&&"width: 100%"}
	}
`,vt=({id:r="location-search",formValues:o,gettingCurrentLocation:a,showLocationModal:l,mustHavePostalCode:i,panelInputMode:s,selectedAddressInfo:d,mapPickedLatLng:c,reverseGeoCodeEndpoint:g,addressFieldPlaceholder:m="Street Name, Postal Code",gettingCurrentLocationFetchMessage:u="Getting current location...",locationListTitle:z="Select location",handleApiErrors:M,onGetLocationCallback:L,onChangeSelectedAddressInfo:$,onCancel:E,onConfirm:P,setSinglePanelMode:S,updateFormValues:N})=>{const{addFieldEventListener:A,removeFieldEventListener:F}=h(),O=C(null),G=C(null),V=C(null),[W,j]=T(!1),[B,D]=T(""),[R,Z]=T(!1),[H,U]=T("pristine"),[_,q]=T(!1),[K,J]=T(-1),[X,Y]=T([]),[Q,tt]=T([]),et=10,[vt,yt]=T(!1),[wt,kt]=T(0),[zt,Mt]=T(1),[Lt,$t]=T(1),{debounceFetchAddress:Ct,fetchSingleLocationByAddress:It,fetchSingleLocationByLatLng:Tt,fetchLocationList:Et}=p,{dispatchFieldEvent:Pt}=h();I((()=>{if(!l)return;Promise.all([Ct("singapore",1,void 0,M),(async()=>{try{p.reverseGeocode({route:g,latitude:1.29994179707526,longitude:103.789404349716,bufferRadius:1,abortSignal:V.current.signal,otherFeatures:x.YES})}catch(t){M(new b(t))}})()])}),[]),I((()=>{navigator.onLine&&!B&&d?.lat&&d?.lng&&Ot(d.lat,d.lng)}),[navigator.onLine]),I((()=>{const t=({detail:{payload:t,errors:e}})=>{if(e instanceof Object&&void 0!==e.code)return void M(new v(e));if(!y.exports.isEmpty(e))return void M(e);if(!t?.lat||!t?.lng)return;const{lat:n,lng:r}=t;Ot(n,r),L(n,r)};return A("set-current-location",r,t),()=>{F("set-current-location",r,t)}}),[]),I((()=>{const t=({displayAddressText:t,...e})=>{const n=!i||p.hasGotAddressValue(e.postalCode);if(y.exports.isEmpty(e)||!n)return N({}),void $({});N(e),$(e),D(e.address)};o?.lat&&o?.lng&&o?.address?It(o.address,t,M):!o?.address||o?.lat||o?.lng?g&&!o?.address&&o?.lat&&o?.lng&&Tt(g,o.lat,o.lng,t,M):It(o.address,t,M)}),[]),I((()=>{c?.lat&&c?.lng&&Ot(c.lat,c.lng)}),[c?.lat,c?.lng]),I((()=>{if("found"===H)return;const t=Vt(B);if(!t)return Ft();(O.current?.value!==u&&O.current?.value!==d?.address||"pristine"===H)&&q(!0),Ct(t,1,(e=>{J(d?.address===t?0:-1),Gt({results:e.results,queryString:B,boldResults:!0,apiPageNum:e.apiPageNum,totalNumPages:e.totalNumPages}),G.current?.scrollTo&&G.current?.scrollTo(0,0)}),(t=>{t instanceof SyntaxError||t instanceof TypeError?Gt({results:[],queryString:B}):(Ft(),M(new b(t)))}))}),[et,B]),I((()=>{yt(!1),zt<wt&&yt(!0),Lt<Q.length/et&&yt(!0)}),[wt,zt,Lt,Q.length,et]);const St=()=>{o?.address&&o?.lat&&o?.lng?D(o.address):(D(""),Ft()),U("pristine"),E()},Nt=()=>{O.current?.focus(),X.length>0&&S("search")},At=(t,e)=>{!Pt("error",r,{payload:{errorType:t}})||e()},Ft=()=>{J(-1),$t(1),kt(0),Mt(0),tt([]),Y([]),G.current?.scrollTo&&G.current?.scrollTo(0,0)},Ot=async(t,e)=>{if(!g)return;const n=t=>{D(""),M(t)};let r;try{r=await Et(g,t,e,i,V,n,!0)}catch(t){return}if(0===r.length){D("");return void((d.lat!==t||d.lng!==e)&&$({lat:t,lng:e}))}G.current?.scrollTo(0,0),Gt({results:r});const[{displayAddressText:o,...a}]=r;if(i&&!p.hasGotAddressValue(a.address))return Z(!0),void D("");D(a.address),$(a),J(0)},Gt=t=>{const{results:e,boldResults:n,apiPageNum:r,totalNumPages:o,queryString:a}=t;let l=e;if(n&&a&&(l=ot(l,a)),l.length>et){const t=rt(l,et,1);Y(t)}else Y(l);tt(e),kt(o||1),q(!1),Mt(r||1),U(l.length>0?"found":"not-found")},Vt=t=>{if(t)return t.trim().replace(/^[$\s]*/,"")};return t(n,{children:[t(at,{id:f.generateId(r,"location-search"),"data-testid":f.generateId(r,"location-search"),panelInputMode:s,children:[e(it,{onClick:St,id:f.generateId(r,"location-search-modal-close"),"data-testid":f.generateId(r,"location-search-modal-close"),children:e(ct,{})}),t(lt,{hasScrolled:W,children:[e(it,{onClick:Nt,id:f.generateId(r,"location-search-modal-search"),children:e(st,{src:"https://assets.life.gov.sg/web-frontend-engine/img/icons/search.svg",alt:"Search"})}),e(dt,{id:f.generateId(r,"location-search-modal-input"),"data-testid":f.generateId(r,"location-search-modal-input"),type:"text",onFocus:Nt,onChange:async t=>{const e=t.target.value;D(e),U("pristine"),S("search")},placeholder:m,readOnly:a,value:a?u:B,ref:O}),e(it,{onClick:()=>{D(""),U("pristine"),S("map")},id:f.generateId(r,"location-search-input-clear"),"data-testid":f.generateId(r,"location-search-input-clear"),children:e(pt,{type:"cross"})})]}),e(ft,{id:f.generateId(r,"location-search-results"),"data-testid":f.generateId(r,"location-search-results",s),panelInputMode:s,ref:G,onScroll:()=>{G.current&&(G.current?.scrollTop>0&&!W?j(!0):G.current?.scrollTop<=0&&W&&j(!1))},children:!a&&t(n,{children:[X.length?e(gt,{children:z}):null,e(nt,{items:X.map(((n,r)=>t(ut,{onClick:()=>((t,e)=>{const{displayAddressText:n,...r}=t;!i||p.hasGotAddressValue(r.postalCode)?(U("found"),J(e),D(r.address??""),$(r)):At("PostalCodeError",(()=>{Z(!0)}))})(n,r),active:K===r,id:f.generateId(`location-search-modal-search-result-${r+0}`),"data-testid":f.generateId(`location-search-modal-search-result-${r+0}`,void 0,K===r?"active":void 0),children:[e(ht,{src:"https://assets.life.gov.sg/web-frontend-engine/img/icons/location-pin-black.svg",alt:"Location"}),e(w,{sanitizeOptions:{allowedTags:["span"],allowedAttributes:{span:["class"]}},children:n.displayAddressText})]},`${r}_${n.lat}_${n.lng}`))),loading:_,hasNextPage:vt,loadMore:()=>{if(q(!0),X.length<Q.length){const t=Lt+1;$t(t);const e=rt(Q,et,t),n=ot(e,B);Y(X.concat(n)),q(!1)}else Ct(B,zt+1,(t=>{const e=ot(t.results,B);if(e.length>et){const t=rt(e,et,1);Y(X.concat(t))}else Y(X.concat(e));tt(Q.concat(e)),kt(t.totalNumPages),q(!1),Mt(t.apiPageNum)}),(t=>{Ft(),M(new b(t))}))}}),!_&&"not-found"===H&&t(mt,{children:["No results found for “",B,"”"]})]})}),t(bt,{id:f.generateId(r,"location-search-controls"),"data-testid":f.generateId(r,"location-search-controls"),panelInputMode:s,children:[e(xt,{buttonType:"cancel",styleType:"light",onClick:St,children:"Cancel"}),e(xt,{buttonType:"confirm",onClick:P,disabled:K<0||"found"!==H,children:"double"!==s?"Confirm location":"Confirm"})]})]}),R&&e(k,{id:`${r}-postal-code-error`,title:"Oops",size:"large",show:!0,description:"The location you have selected does not contain a postal code.",buttons:[{id:"ok",title:"OK",onClick:()=>Z(!1)}]})]})},yt=P.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	/* to take full width of modal */
	flex: 1;
`,wt=P.img`
	width: 12.5625rem;

	${m.MaxWidth.mobileL} {
		width: 11.5rem;
	}
`,kt=P(z.Body)`
	text-align: center;
	margin: 1.5rem auto 0.5rem;

	${m.MaxWidth.mobileL} {
		font-size: 0.875rem !important;
	}
`,zt=P(z.Body)`
	text-align: center;
	width: 100%;

	${m.MaxWidth.mobileL} {
		font-size: 0.875rem !important;
		max-width: 14rem;
	}
`,Mt=P(M.Default)`
	margin-top: 2.5rem;
	width: 100%;
	max-width: 16.5rem;

	${m.MaxWidth.mobileL} {
		max-width: 16.5rem;
	}
`,Lt=({id:n,cachedImage:r,refreshNetwork:o})=>t(yt,{id:f.generateId(n,"no-internet-connectivity"),"data-testid":f.generateId(n,"no-internet-connectivity"),children:[e(wt,{src:r,alt:"no-connectivity"}),e(kt,{weight:"semibold",children:"No connection found"}),e(zt,{children:"Check your internet connection and try again."}),e(Mt,{onClick:o,children:"Try again"})]}),$t=({id:o="location-modal",className:a,formValues:l,showLocationModal:i,mapPanZoom:d,interactiveMapPinIconUrl:c,reverseGeoCodeEndpoint:p,gettingCurrentLocationFetchMessage:g,mustHavePostalCode:m,locationModalStyles:u,onClose:x,onConfirm:w,updateFormValues:z})=>{const[M,C]=T("double"),[E,P]=T({}),[S,N]=T(!0),[F,O]=T(!1),{dispatchFieldEvent:G,addFieldEventListener:V,removeFieldEventListener:W}=h(),[j,H]=T(!0),[U,_]=T(!1),[q,K]=T(!1),[J,X]=T(!1),[Y,Q]=T();I((()=>{const t=t=>{const e=t.detail?.payload?.errorType;if(e)switch(e){case"OneMapError":case"GetLocationTimeoutError":tt()}};return V("error-end",o,t),()=>{W("error-end",o,t)}}),[]),I((()=>{if(!window)return;const t=matchMedia(`(max-width: ${r.tablet}px)`);C(t.matches?"map":"double");const e=()=>H(!0),n=()=>H(!1),o=t=>{C(t.matches?"map":"double")};return window.addEventListener("online",e),window.addEventListener("offline",n),t.addEventListener("change",o),()=>{window.removeEventListener("online",e),window.removeEventListener("offline",n),t.removeEventListener("change",o)}}),[]),I((()=>{i?l?.lat||l?.lng||rt():"double"!==M&&C("map")}),[i]),I((()=>{y.exports.isEmpty(E)||"search"!==M||nt("map")}),[E,F]);const tt=()=>{x()},et=()=>{_(!1)},nt=t=>{"double"!==M&&C(t)},rt=async()=>{O(!0);if(!!G("get-current-location",o)){const t={};try{t.payload=await L.getCurrentLocation()}catch(e){t.errors=e}G("set-current-location",o,t)}},ot=()=>{P(l||{})};return t(n,{children:[e(Z,{src:A,alt:"no internet connectivity"}),e(s,{id:f.generateId(o,"modal",i?"show":"hide"),show:i,children:e(B,{id:f.generateId(o,"modal-box"),className:`${a}-modal-box`,showCloseButton:!1,locationModalStyles:u,children:j?t(n,{children:[e(vt,{id:o,onCancel:()=>{ot(),tt()},onConfirm:()=>{w(E),tt()},updateFormValues:z,gettingCurrentLocation:F,panelInputMode:M,selectedAddressInfo:E,mapPickedLatLng:Y,formValues:l,onChangeSelectedAddressInfo:P,handleApiErrors:t=>{const e=(e,n)=>{!G("error",o,{payload:{errorType:e},errors:t})||n()};O(!1),t instanceof b?e("OneMapError",(()=>{ot(),K(!0)})):(N(!1),t instanceof v&&t?.code?.toString()===GeolocationPositionError.TIMEOUT.toString()?e("GetLocationTimeoutError",(()=>{X(!0)})):e("GetLocationError",(()=>{_(!0)})))},onGetLocationCallback:()=>{O(!1),N(!0)},setSinglePanelMode:nt,showLocationModal:i,reverseGeoCodeEndpoint:p,gettingCurrentLocationFetchMessage:g,mustHavePostalCode:m}),e(D,{id:o,panelInputMode:M,locationAvailable:S,gettingCurrentLocation:F,showLocationModal:i,selectedLocationCoord:{lat:E.lat,lng:E.lng},getCurrentLocation:rt,onMapCenterChange:t=>{Q(t)},interactiveMapPinIconUrl:c,mapPanZoom:d})]}):e(Lt,{id:o,cachedImage:A,refreshNetwork:()=>{try{navigator.onLine&&H(!0)}catch(t){}}})})}),(()=>{if(j&&i)return q?e(k,{id:f.generateId(o,"onemap-error"),"data-testid":f.generateId(o,"onemap-error"),title:"Map not available",size:"large",show:!0,image:e(R,{src:"https://assets.life.gov.sg/web-frontend-engine/img/common/error.svg"}),description:t($,{weight:"regular",children:["Sorry, there was a problem with the map. You’ll not be able to enter the location right now. Please try again later.",e("br",{}),e("br",{}),"Do note that you’ll not be able to submit your report without entering the location."]}),buttons:[{id:"ok",title:"OK",onClick:()=>{K(!1),tt()}}]}):U?e(k,{id:f.generateId(o,"get-location-error"),"data-testid":f.generateId(o,"get-location-error"),title:"Enable location settings",size:"large",show:!0,description:"We need your permission to determine your location. Enable location access in your browser and device settings, or enter your location manually.",buttons:[{id:"ok",title:"OK",onClick:et}]}):J?e(k,{id:f.generateId(o,"get-location-timeout-error"),"data-testid":f.generateId(o,"get-location-timeout-error"),title:"Something went wrong",size:"large",show:!0,image:e(R,{src:"https://assets.life.gov.sg/web-frontend-engine/img/icons/get-location-timeout.svg"}),description:e($,{weight:"regular",children:"It’s taking longer than expected to retrieve your location. Please exit the map and try again."}),buttons:[{id:"ok",title:"OK",onClick:()=>{X(!1),tt()}}]}):void 0})()]})};export{$t as default};
//# sourceMappingURL=location-modal.826d92b1.js.map
