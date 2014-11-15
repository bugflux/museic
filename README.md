museic
======

Museic is a Javascript image mosaic builder focused on randomness within a limited area.


Preview [here](https://rawgit.com/bugflux/museic/master/example/index.html)

## Usage

Right now Mosaic can be invoked as a function and accepts a single object as parameter with all the options. First import the files.

```html
	<script src="js/museic.js"></script>
	<link rel="stylesheet" type="text/css" href="css/museic.css">
```

Then call it.

```javascript
Mosaic({
	elem: _div, // mandatory. the DOM element where the mosaic will be added

	x: 8, // mandatory. max number of images horizontally
	y: 7, // mandatory. max number of images vertically

	// mandatory. the list of, at least, x * y objects containing each image identified by "url"
	// additional data may be added in other parameters for use in the event handlers.
	data: [
		{
			url: 'https://farm6.staticflickr.com/5579/14945523969_e5f92943f2_z.jpg',
		},
		{
			url: 'https://farm4.staticflickr.com/3923/15132225545_3c6538edac_z.jpg',
		}
		// ...
	],

	// optional. handlers for DOM events on each image. All DOM events are supported.
	// handlers receive one parameter corresponding to the data of an image,
	// provided by the user in the "data" parameter
	events: {
		click: _callback
		// ...
	},

	border: 5 // optional (default = 0). blank pixels around each image 
});
```

## Strategy

Given the X, Y dimensions of the desired grid, and at least X * Y images, the algorithm proceeds as follows:

1. Pick an unused (X, Y) coordinate randomly, to start to try and place an image.
2. The algorithm picks one direction (up, down, left, right), with equal probability, and checks if the image can grow one square in that direction. If it can, this step is repeated, if not proceed.
3. One of the provided images is removed from the list and placed on the computed space.
4. Repeat from step 2 until no more coordinates are left blank.
