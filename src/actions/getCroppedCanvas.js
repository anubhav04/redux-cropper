import { zero, one, pointFromSize } from '../records/point'
import { getRotatedSizes } from '../utilities'
import Immutable from 'immutable'

const getSourceCanvas = (params) => {
	const { imageElem, image, canvasData } = params;
	const naturalSize  = image.get('naturalSize');
	let canvasSize  = canvasData.get('size');
	const rotate = image.get('rotate');
	const scale = image.get('scale');

	const scalable = scale.get('x') &&
		scale.get('y') &&
		(scale.get('x') !== 1 || scale.get('y') !== 1);

	const rotatable = rotate && rotate !== 0;
	const advanced = rotatable || scalable;

	let translate = scalable ? canvasSize.divideScalar(2) : null;
	let rotated;
	if (rotatable) {
		rotated = getRotatedSizes({
			sizePoint: naturalSize,
			degree: rotate,
			aspectRatio: image.get('aspectRatio')
		});

		canvasSize = rotated;
		translate = rotated.divideScalar(2);
	}

	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');

	canvas.width = canvasSize.get('x');
	canvas.height = canvasSize.get('y');

	let offset = zero;
	if (advanced) {
		offset = canvasSize.negate().divideScalar(2);

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

	context.drawImage(imageElem, offset.get('x'), offset.get('y'), canvasSize.get('x'), canvasSize.get('y'));

	if (advanced) {
		context.restore();
	}

	return canvas;
};

const getDrawImageParams = (params)=> {
	const { imageElem, cropData, data, scaledRatio } = params;
	const originalSize = data.get('size');
	let srcPoint = data.get('offset');

	const sourceCanvas = getSourceCanvas({imageElem, image:cropData.image, canvasData:cropData.canvas});
	const sourceSize = pointFromSize(sourceCanvas);

	let args = [sourceCanvas];

	let dstPoint = zero;
	let srcSize = zero;
	let dstSize = zero;

	if (srcPoint.get('x') <= -originalSize.get('x') ||
		srcPoint.get('x') > sourceSize.get('x')) {
		srcPoint = srcPoint.set('x', 0);
	} else if (srcPoint.get('x') <= 0) {
		dstPoint = dstPoint.set('x', -srcPoint.get('x'));
		srcPoint = srcPoint.set('x', 0);
		const _width = Math.min(sourceSize.get('x'), originalSize.get('x') + srcPoint.get('x'));

		srcSize = srcSize.set('x', _width);
		dstSize = dstSize.set('x', _width);
	} else if (srcPoint.get('x') <= sourceSize.get('x')) {
		dstPoint = dstPoint.set('x', 0);

		const _width = Math.min(originalSize.get('x'), sourceSize.get('x') - srcPoint.get('x'));
		srcSize = srcSize.set('x', _width);
		dstSize = dstSize.set('x', _width);
	}

	if (srcSize.get('x') <= 0 ||
		srcPoint.get('y') <= -originalSize.get('y') ||
		srcPoint.get('y') > sourceSize.get('y')) {
		srcPoint = srcPoint.set('y', 0);
	} else if (srcPoint.get('y') <= 0) {
		dstPoint = dstPoint.set('y', -srcPoint.get('y'));
		srcPoint = srcPoint.set('y', 0);

		const _width = Math.min(sourceSize.get('x'), originalSize.get('y') + srcPoint.get('y'));
		srcSize = srcSize.set('y', _width);
		dstSize = dstSize.set('y', _width);
	} else if (srcPoint.get('y') <= sourceSize.get('y')) {
		dstSize = dstSize.set('y', 0);

		const _height = Math.min(originalSize.get('y'), sourceSize.get('y') - srcPoint.get('y'));
		srcSize = srcSize.set('y', _height);
		dstSize = dstSize.set('y', _height);
	}

	args = [
		...args,
		srcPoint.get('x'),
		srcPoint.get('y'),
		srcSize.get('x'),
		srcSize.get('y')
	];

	// Scale destination sizes
	if (scaledRatio) {
		dstPoint = dstPoint.scaleScalar(scaledRatio);
		dstSize = dstSize.scaleScalar(scaledRatio);
	}

	// Avoid "IndexSizeError" in IE and Firefox
	if (dstSize.get('x') > 0 && dstSize.get('y') > 0) {
		args = [
			...args,
			dstPoint.get('x'),
			dstPoint.get('y'),
			dstSize.get('x'),
			dstSize.get('y')
		]
	}

	return args;
};

export const getOffscreenCroppedImagePromise = (obj)=>
	new Promise((resolve, reject)=>{
		try {
			var downloadingImage = new Image();
			downloadingImage.onload = function(){
				const imageElem = document.createElement("img");
				imageElem.src = this.src;

				const canvas = getCroppedImageCanvas({...obj, imageElem});
				var uri = canvas.toDataURL("image/png", 1);
				resolve(uri)
			};
			downloadingImage.src = obj.options.get('url');
		} catch(ex){
			reject(ex);
		}
	});

export const getCroppedImageCanvas = (params) => {
	const { imageElem, options, cropData, isRounded } = params;

	const data = getData({options, cropData, isRounded});

	const originalSize = data.get('size');
	const aspectRatio = originalSize.getAspectRatio();
	let scaledSize = pointFromSize(options.get('size'));
	let scaledRatio;
	if (scaledSize.get('x')) {
		scaledSize = scaledSize.set('y', scaledSize.get('x') / aspectRatio);
		scaledRatio = scaledSize.get('x') / originalSize.get('x');
	} else if (scaledSize.get('y')) {
		scaledSize = scaledSize.set('x', scaledSize.get('y') * aspectRatio);
		scaledRatio = scaledSize.get('y') / originalSize.get('y');
	}

	const canvasSize = pointFromSize({
		width: Math.round(scaledSize.get('x') || originalSize.get('x')),
		height: Math.round(scaledSize.get('y') || originalSize.get('y'))
	});

	const canvas = document.createElement('canvas');
	canvas.width = canvasSize.get('x');
	canvas.height = canvasSize.get('y');
	const context = canvas.getContext('2d');

	if (options.get('fillColor')) {
		context.fillStyle = options.get('fillColor');
		context.fillRect(0, 0, canvasSize.get('x'), canvasSize.get('y'));
	}

	const drawImageParams = getDrawImageParams({imageElem, data, cropData, scaledRatio});

	// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.drawImage
	context.drawImage.apply(context, drawImageParams);

	return canvas;
};

const getData = (params) => {
	const { options, cropData, isRounded } = params;
	const { image, canvas, cropBox } = cropData;

	let data = Immutable.fromJS({
		offset: cropBox.get('offset').subtract(canvas.get('offset')),
		size: cropBox.get('size')
	});

	const ratio = image.getIn(['size', 'x']) / image.getIn(['naturalSize', 'x']);
	data = data.update('offset', (point)=> {
		const newPoint = point.divideScalar(ratio);
		return isRounded ? newPoint.updateCoordsOnTransform(Math.round) : newPoint;
	});

	if (options.get('rotatable')) {
		data = data.set('rotate', image.get('rotate') || 0)
	}

	if (options.get('scalable')) {
		data = data.set('scaleSize', image.get('scaleSize') || one)
	}

	return data;
};
