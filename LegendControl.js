/*!
 * LegendControl.js v1.0
 * 
 * Copyright 2010, Andrew Hedges, andrew@hedges.name
 * Licensed under the MIT license (see below).
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Date: Mon Feb 08 19:19:19 2010 +1300
 * @requires MarkerManager http://gmaps-utility-library-dev.googlecode.com/
 */

/*	The MIT License
	
	Copyright (c) 2010 Andrew Hedges
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/

var LegendControlParams_;

/**
 * Define legend control
 * @param object params Object literal of parameters:
                           mgr          Instance of MarkerManager
                           legendValues 
                           markerGroups 
 * @return void
 */
function LegendControl(params) {
	// save the parameters to the global scope because they'll be overwritten
	LegendControlParams_ = params;
}

/**
 * Subclass GControl
 */
LegendControl.prototype = new GControl();

/**
 * Initialize the control (required by Google Maps API)
 * @param object map Instance of GMap2
 * @return DOM object
 */
LegendControl.prototype.initialize = function(map) {
	var styles, container;
	
	// styles for the legend container
	styles = {
		padding    : '5px 12px 10px 10px',
		border     : 'solid 1px #333',
		background : 'white',
		fontFamily : 'Arial, Sans-Serif',
		'-moz-border-radius'    : '6px',
		'-webkit-border-radius' : '6px' // this doesn't seem to work, any ideas?
	};
	
	container = document.createElement('div');
	
	// apply styles to the container
	container = this.setStyles_(container, styles);
	
	// add pins, checkboxes, and descriptions
	container = this.addLegendValues_(container);
	
	// display the legend
	map.getContainer().appendChild(container);
	
	return container;
};
// END: LegendControl.prototype.initialize

/**
 * Set the default position and padding for the control (required by Google Maps API)
 * @return GControlPosition
 */
LegendControl.prototype.getDefaultPosition = function() {
	// will position the control 32px from the top of the map and 7px from the right
	return new GControlPosition(G_ANCHOR_TOP_RIGHT, new GSize(7, 32));
};
// END: TextualZoomControl.prototype.getDefaultPosition

/**
 * Add values for the legend
 * @param object container DOM object
 * @return void
 */
LegendControl.prototype.addLegendValues_ = function (container) {
	var item;
	for (item in LegendControlParams_.legendValues) {
		if ('function' !== typeof LegendControlParams_.legendValues[item]) {
			// attach new legend item to the legend container
			container.appendChild(this.createLegendItem_(LegendControlParams_.legendValues[item]));
		}
	}
	return container;
};
// END: LegendControl.prototype.addLegendValues

/**
 * Add values for the legend
 * @param array legendItemValues Object literal
 * @return void
 */
LegendControl.prototype.createLegendItem_ = function (legendItemValues) {
	var that, styles, item;
	
	that = this; // crockford's trick
	
	// styles for each legend item's container
	styles = {
		display  : 'block',
		margin   : '5px 0',
		fontSize : '10px',
		clear    : 'left'
	};
	
	item = document.createElement('label');
	
	// apply styles to the container
	item = this.setStyles_(item, styles);
	
	item.innerHTML = '<img src="' + legendItemValues.pinSrc + '" alt="" style="position: relative;bottom: -4px;">&nbsp;<input type="checkbox" value="' + legendItemValues.type + '" checked="checked">&nbsp;' + legendItemValues.description;
	
	GEvent.addDomListener(item, 'click', function(evt) {
		// filter out multiple click events caused by clicking on <label>
		if ('input' === evt.target.tagName.toLowerCase()) {
			// update marker manager's grid
			if (true === evt.target.checked) {
				that.addMarkers_(LegendControlParams_.markerGroups[evt.target.value]);
			}
			else {
				that.removeMarkers_(LegendControlParams_.markerGroups[evt.target.value]);
			}
		}
	});
	
	return item;
};
// END: LegendControl.prototype.createLegendItem_

/**
 * Add markers of a particular type (colour) to the map
 * @param array markerGroup Array of GMarker instances
 * @return void
 */
LegendControl.prototype.addMarkers_ = function(markerGroup) {
	var i, len;
	for (i = 0, len = markerGroup.length; i < len; ++i) {
		LegendControlParams_.mgr.addMarker(markerGroup[i], markerGroup[i].zoomMin, markerGroup[i].zoomMax);
	}
	LegendControlParams_.mgr.refresh();
};
// END: addMarkers

/**
 * Remove markers of a particular type (colour) from the map
 * @param array markerGroup Array of GMarker instances
 * @return void
 */
LegendControl.prototype.removeMarkers_ = function(markerGroup) {
	var i, len;
	for (i = 0, len = markerGroup.length; i < len; ++i) {
		LegendControlParams_.mgr.removeMarker(markerGroup[i]);
	}
	LegendControlParams_.mgr.refresh();
};
// END: removeMarkers

/**
 * Apply styles to an element
 * @param object element DOM element
 * @param object styles  Object literal
 * @return DOM element
 */
LegendControl.prototype.setStyles_ = function (element, styles) {
	var key;
	for (key in styles) {
		if ('function' !== typeof styles[key]) {
			element.style[key] = styles[key];
		}
	}
	return element;
};
// END: LegendControl.prototype.setStyles_
