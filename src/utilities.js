export const isNumber = (n) => typeof n === 'number' && !isNaN(n);

export const isUndefined = (n) => typeof n === 'undefined';

export const toArray = (obj, offset) => {
	const args = [];

	// This is necessary for IE8
	if (isNumber(offset)) {
		args.push(offset);
	}

	return args.slice.apply(obj, args);
};

export const isCrossOriginURL = (url) => {
	const parts = url.match(/^(https?:)\/\/([^\:\/\?#]+):?(\d*)/i);

	return parts && (
			parts[1] !== location.protocol ||
			parts[2] !== location.hostname ||
			parts[3] !== location.port
		);
};

export const addTimestamp = (url) => {
	const timestamp = 'timestamp=' + (new Date()).getTime();

	return (url + (url.indexOf('?') === -1 ? '?' : '&') + timestamp);
};

export const getImageSize = (image, callback) => {
	let newImage;

	// Modern browsers
	if (image.naturalWidth) {
		return callback(image.naturalWidth, image.naturalHeight);
	}

	// IE8: Don't use `new Image()` here (#319)
	newImage = document.createElement('img');

	newImage.onload = function () {
		callback(this.width, this.height);
	};

	newImage.src = image.src;
};

export const getTransform = ({scale, rotate}) => {
	const _scale = scale ? scale : {x: 0, y: 0};
	const transforms = [];

	if (isNumber(rotate)) {
		transforms.push('rotate(' + rotate + 'deg)');
	}

	if (isNumber(_scale.x) && isNumber(_scale.x)) {
		transforms.push('scale(' + _scale.x + ',' + _scale.y + ')');
	}

	return transforms.length ? transforms.join(' ') : 'none';
};

export const getRotatedSizes = ({sizePoint, degree, aspectRatio, isReversed}) => {
	let newSizePoint = sizePoint;
	const deg = Math.abs(degree) % 180;
	const arc = (deg > 90 ? (180 - deg) : deg) * Math.PI / 180;
	const sinArc = Math.sin(arc);
	const cosArc = Math.cos(arc);

	if (!isReversed) {
		newSizePoint = newSizePoint
			.set('x', newSizePoint.get('x') * cosArc + newSizePoint.get('y') * sinArc)
			.set('y', newSizePoint.get('x') * sinArc + newSizePoint.get('y') * cosArc);
	} else {
		newSizePoint = newSizePoint.set('x', newSizePoint.get('x') / (cosArc + sinArc / aspectRatio));
		newSizePoint = newSizePoint.set('y', newSizePoint.get('x') / aspectRatio);
	}

	return newSizePoint;
};

export const getSourceCanvas = (image, data) => {
	const canvas = $('<canvas>')[0];
	const context = canvas.getContext('2d');
	let x = 0;
	let y = 0;
	const {naturalSize, rotate, scale} = data;

	const scalable = isNumber(scale.get('x')) && isNumber(scale.get('y')) && (scale.get('x') !== 1 || scale.get('y') !== 1);
	const rotatable = isNumber(rotate) && rotate !== 0;
	const advanced = rotatable || scalable;
	let canvasSize = naturalSize;
	let translate;

	let rotated;

	if (scalable) {
		translate = naturalSize.divideScalar(2);
	}

	if (rotatable) {
		rotated = getRotatedSizes({sizePoint: naturalSize, degree: rotate});

		canvasSize = rotated;
		translate = rotated.divideScalar(2);
	}

	canvas.width = canvasSize.get('x');
	canvas.height = canvasSize.get('y');

	if (advanced) {
		translate = naturalSize.negate().divideScalar(2);

		context.save();
		context.translate(translate.get('x'), translate.get('y'));
	}

	if (rotatable) {
		context.rotate(rotate * Math.PI / 180);
	}

	// Should call `scale` after rotated
	if (scalable) {
		context.scale(scale.get('x'), scale.get('y'));
	}

	context.drawImage(image, x, y, naturalSize.get('x'), naturalSize.get('y'));

	if (advanced) {
		context.restore();
	}

	return canvas;
};
