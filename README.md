museic
======

Museic is a Javascript mosaic builder focused on randomness within a pre-determined area.

There's an image provider that makes this code an image mosaic builder, but you are encouraged to extend,
modify or implement new providers to create mosaics of anything you like!


Preview [here](https://rawgit.com/bugflux/museic/master/example/index.html)

## Usage

Right now Mosaic can be invoked as a function and accepts a single object as parameter with all the options.

First import the files:

```html
<script src="js/museic.js"></script>
<script src="js/museic-image-provider.js"></script>
```

Then construct the provider and call it.

```javascript
new MuseicImageProvider({
	// mandatory. the list of, at least, x * y objects containing each image identified by "url"
	// additional data may be added in other parameters for use in the event handlers.
	data: [
		{
			url: 'https://farm6.staticflickr.com/5579/14945523969_e5f92943f2_z.jpg'
		},
		{
			url: 'https://farm4.staticflickr.com/3923/15132225545_3c6538edac_z.jpg'
		}
		// ...
	],

	border: 5 // optional (default = 0). blank pixels around each image 

	// optional. handlers for DOM events on each image. All DOM events are supported.
	// handlers are of the form "function(event, data)", where 'event' is the original event
	// triggered by the browserm and 'data' is the corresponding object provided in the initial
	// options allocated to the acted coordinate
	events: {
		click: _callback
		// ...
	}
});

Mosaic({
	elem: _div, // mandatory. the DOM element where the mosaic will be added

	x: 6, // mandatory. max number of images horizontally
	y: 5, // mandatory. max number of images vertically

	provider: provider, // mandatory. an element provider to fill the tiles

	xMax: 6, // optional (default = x). maximum width (in grid elements) for each individual element
	yMax: 5 // optional (default = y). maximum height (in grid elements) for each individual element
});
```

## Providers

Providers need to implement a `get(params)` method that returns a single HTML element to place in the given tile. The `params` argument is an object with the following properties:

* **x**: the XX coordinate computed for the tile
* **y**: the YY coordinate computed for the tile
* **w**: the width computed for the tile
* **h**: the height computed for the tile


## Strategy

Given the X, Y dimensions of the desired grid, and at least X * Y images, the algorithm proceeds as follows:

1. Pick an unused (X, Y) coordinate randomly, to start to try and place an image.
2. Pick one direction (up, down, left, right), with equal probability, and check if the image can grow one square in that direction. If it can, repeat, otherwise proceed.
3. Remove one of the images from the list and render on the determined space.
4. Repeat from step 2 until no more coordinates are left blank.

### Notes

#### Performance
Step (1) of the algorithm can in fact hit an occupied coordinate, but it never does so twice on the same coordinate. In short, step (1) runs exactly X*Y times, and the coordinate is truly randomly picked.

#### Visuals
The selected image at each position is placed as a "background" of a div with the "background-size: cover" and "background-position: center" CSS options.

In my perspective, "cover" is the best option for the sizing of the image, as it guarantees that the entire background area is covered, while scaling and cropping appropriately to fit the image completely in at least one direction.

As for the "center" option, it really depends, because in photography there are many advocates of rules that don't fit quite well here, such as the rule of thirds, golden ratio, fibonacci, etc... Change however you like, and be sure to play with the number of possible horizontal and vertical images to better fit the aspect ratio of your pictures.