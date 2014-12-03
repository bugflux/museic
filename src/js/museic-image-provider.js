/**
 * Museic renders mosaic from source images.
 */
var MuseicImageProvider = function(opt) {
	var o = {
		data: opt.data,
		border: opt.border || 0,
		events: opt.events
	}, getNext;

	if (o.allowDuplicates) {
		getNext = function() {
			return o.data[parseInt(Math.random() * data.length)];
		};
	} else {
		// shuffle the data
		var r = o.data.length, other, buff;
		while (--r >= 0) {
			other = Math.floor(Math.random() * o.data.length);
			buff = o.data[r];
			o.data[r] = o.data[other];
			o.data[other] = buff;
		}

		getNext = function() {
			return o.data.pop();
		}
	}

	this.get = function(params) {
		var d = getNext(), e = document.createElement('div');
		e.style.position = 'absolute';
		e.style.top = e.style.bottom = e.style.right = e.style.left = o.border + 'px';
		e.style.backgroundPosition = 'center';
		e.style.backgroundSize = 'cover';
		e.style.backgroundImage = 'url("' + d.url+ '")';

		// register event listeners
		if (o.events) {
			Object.keys(o.events).forEach(function(v) {
				e.addEventListener(v, function(event) {
					o.events[v](event, d);
				});
			});
		}

		return e;
	};
};
