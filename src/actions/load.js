export const init = () => {
	const $this = this.$element;
	let url;

	if ($this.is('img')) {
		this.isImg = true;

		// Should use `$.fn.attr` here. e.g.: "img/picture.jpg"
		this.originalUrl = url = $this.attr('src');

		// Stop when it's a blank image
		if (!url) {
			return;
		}

		// Should use `$.fn.prop` here. e.g.: "http://example.com/img/picture.jpg"
		url = $this.prop('src');
	} else if ($this.is('canvas') && SUPPORT_CANVAS) {
		url = $this[0].toDataURL();
	}

	this.load(url);
};

export const load = (url)=> {
	const options = this.options;
	const $this = this.$element;
	let crossOrigin = '';
	let bustCacheUrl;
	let $clone;

	if (!url) {
		return;
	}

	this.url = url;

	if (options.checkCrossOrigin && isCrossOriginURL(url)) {
		crossOrigin = $this.prop('crossOrigin');

		// Bust cache (#148), only when there was not a "crossOrigin" property
		if (!crossOrigin) {
			crossOrigin = 'anonymous';
			bustCacheUrl = addTimestamp(url);
		}
	}

	this.crossOrigin = crossOrigin;
	this.$clone = $clone = $('<img' + getCrossOrigin(crossOrigin) + ' src="' + (bustCacheUrl || url) + '">');

	if (this.isImg) {
		if ($this[0].complete) {
			this.start();
		} else {
			$this.one(EVENT_LOAD, this.start);
		}
	} else {
		$clone.
		one(EVENT_LOAD, this.start).
		one(EVENT_ERROR, this.stop).
		addClass(CLASS_HIDE).
		insertAfter($this);
	}
};

export const start = () => {
	let $image = this.$element;
	const $clone = this.$clone;

	if (!this.isImg) {
		$clone.off(EVENT_ERROR, this.stop);
		$image = $clone;
	}

	getImageSize($image[0], function (naturalWidth, naturalHeight) {
		this.image = {
			naturalWidth: naturalWidth,
			naturalHeight: naturalHeight,
			aspectRatio: naturalWidth / naturalHeight
		};

		this.isLoaded = true;
		this.build();
	});
};

export const stop = () => {
	this.$clone.remove();
	this.$clone = null;
};
