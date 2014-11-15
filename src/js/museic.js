/**
 * Museic renders mosaic from source images. Documentation coming soon.
 */
var Mosaic = function (opt) {
	var o = {
		
		elem: opt.elem,
		imgs: opt.imgs,

		x: opt.x,
		y: opt.y

	};

	// perform N swaps
	var shuffle = function (array) {
		var r, other, buff;
		for (r = 0; r < array.length; r++)	{
			other = Math.floor(Math.random() * array.length);
			buff = array[r];
			array[r] = array[other];
			array[other] = buff;
		}
	};

	var tagMapPositions = function (map, coord, dim) {
		var r, c;
		for (r = 0; r < dim.h; r++) {
			for (c = 0; c < dim.w; c++) {
				map[coord.y + r][coord.x + c] = true;
			}
		}
	};

	var colCollides = function (map, coord, dim) {
		var r;
		for (r = 0; r < dim.h; r++) {
			if (map[coord.y + r][coord.x]) {
				return true;
			}
		}
		return false;
	}, rowCollides = function (map, coord, dim) {
		var c;
		for (c = 0; c < dim.w; c++) {
			if (map[coord.y][coord.x + c]) {
				return true;
			}
		}
		return false;
	};

	var doTheMagic = function() {
		var map, r, c, rnd, coords, coord, divs, div, dim = {};

		// allocate the mapping grid and "remaining" coordinates
		map = new Array(o.y);
		coords = [];
		for (r = 0; r < o.y; r++) {
			map[r] = new Array(o.x);

			for (c = 0; c < o.x; c++){
				coords.push({
					x: c,
					y: r
				});
			}
		}

		shuffle(coords);
		shuffle(o.imgs);

		divs = document.createElement('div');

		while(coords.length > 0) {
			coord = coords.pop();

			// check if coord is taken
			if (map[coord.y][coord.x]) {
				continue;
			}

			// free, create div
			div = document.createElement('div');

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
			div.className = "museic-tile";
			div.style.position = 'absolute';
			div.style.top = ((coord.y * 100) / o.y) + '%';
			div.style.left = ((coord.x * 100) / o.x) + '%';
			div.style.height = ((dim.h * 100) / o.y) + '%';
			div.style.width = ((dim.w * 100) / o.x) + '%';

			div.style.backgroundImage = "url('" + o.imgs.pop() + "')";

			// save the div
			divs.appendChild(div);
		}

		o.elem.appendChild(divs);
	};

	doTheMagic();
};
