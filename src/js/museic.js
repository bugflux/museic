/**
 * Museic renders mosaic from source images.
 */
var Mosaic = function(opt) {
	var o = {
		
		elem: opt.elem,
		data: opt.data,

		x: opt.x,
		y: opt.y,

		border: opt.border || 0,

		events: opt.events,
		delegateData: {},

	};

	// perform N swaps
	var shuffle = function(array) {
		var r = array.length, other, buff;
		while (--r >= 0) {
			other = Math.floor(Math.random() * array.length);
			buff = array[r];
			array[r] = array[other];
			array[other] = buff;
		}
	};

	var tagMapPositions = function(map, coord, dim) {
		var r = dim.h + coord.y, c;
		while (--r >= coord.y) {
			c = dim.w + coord.x;
			while (--c >= coord.x) {
				map[r][c] = true;
			}
		}
	};

	var colCollides = function(map, coord, dim) {
		var r = dim.h + coord.y;
		while (--r >= coord.y) {
			if (map[r][coord.x]) {
				return true;
			}
		}
		return false;
	}, rowCollides = function(map, coord, dim) {
		var c = dim.w + coord.x;
		while (--c >= coord.x) {
			if (map[coord.y][c]) {
				return true;
			}
		}
		return false;
	};

	var doTheMagic = function() {
		var map, r, c, rnd, coords, coord, divs, div, bg, dim = {}, data, id = 0;

		// allocate the mapping grid and "remaining" coordinates
		map = new Array(o.y);
		coords = [];
		r = o.y;
		while (--r >= 0) {
			map[r] = new Array(o.x);

			c = o.x;
			while (--c >= 0) {
				coords.push({
					x: c,
					y: r
				});
			}
		}

		shuffle(coords);
		shuffle(o.data);

		divs = document.createElement('div');
		divs.className = 'museic-container';

		while(coords.length > 0) {
			coord = coords.pop();

			// check if coord is taken
			if (map[coord.y][coord.x]) {
				continue;
			}

			// free, create divs
			div = document.createElement('div');
			bg = document.createElement('div');
			data = o.data.pop();

			div.id = id++;
			o.delegateData[div.id] = data;

			// from this coordinate, try to "grow" the rectangle in one of four directions,
			// with equal probability. growth stops once an obstacle is found.
			dim.w = dim.h = 1;

			while (true) {
				rnd = Math.random();
				if (rnd >= 0.75) {
					// test w+1 right
					if (coord.x + dim.w === o.x) {
						break;
					}

					dim.w++;
					if (colCollides(map, { x: coord.x + dim.w - 1, y: coord.y }, dim)) {
						dim.w--;
						break;
					}

				} else if (rnd >= 0.5) {
					// test w+1 left
					if (coord.x === 0) {
						break;
					}

					dim.w++;
					coord.x--;
					if (colCollides(map, coord, dim)) {
						dim.w--;
						coord.x++;
						break;
					}

				} else if (rnd >= 0.25) {
					// test h+1 down
					if (coord.y + dim.h === o.y) {
						break;
					}

					dim.h++;
					if (rowCollides(map, { x: coord.x, y: coord.y + dim.h - 1 }, dim)) {
						dim.h--;
						break;
					}

				} else {
					// test h+1 up
					if (coord.y === 0) {
						break;
					}

					dim.h++;
					coord.y--;
					if (rowCollides(map, coord, dim)) {
						dim.h--;
						coord.y++;
						break;
					}
				}
			}

			// mark the positions as occupied
			tagMapPositions(map, coord, dim);

			// style div according to those limits
			div.className = 'museic-tile';
			div.style.top = ((coord.y * 100) / o.y) + '%';
			div.style.left = ((coord.x * 100) / o.x) + '%';
			div.style.height = ((dim.h * 100) / o.y) + '%';
			div.style.width = ((dim.w * 100) / o.x) + '%';

			bg.className = 'museic-bg';
			bg.style.top = bg.style.right = bg.style.bottom = bg.style.left = o.border + 'px';
			bg.style.backgroundImage = "url('" + data.url + "')";

			// save the div
			div.appendChild(bg);
			divs.appendChild(div);
		}

		// register event listeners
		if (o.events) {
			Object.keys(o.events).forEach(function(v) {
				divs.addEventListener(v, function(event) {
					o.events[v](event, o.delegateData[event.target.parentNode.id]);
				});
			});
		}

		o.elem.appendChild(divs);
	};

	doTheMagic();
};
