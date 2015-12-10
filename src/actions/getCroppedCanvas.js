import { zero, one, pointFromSize } from '../records/point'
import { getRotatedSizes } from '../utilities'
import Immutable from 'immutable'

export const getOffscreenCroppedImagePromise = (obj)=>
	new Promise((resolve, reject)=>{		
			const downloadingImage = new Image();
			downloadingImage.onload = function() {
				try {
					resolve(getBlobFromSrc({
						obj, 
						src: this.src, 
						type: "image/png", 
						quality: 1
					}))
				} catch(ex){
					reject(ex);
				}
			};
			downloadingImage.src = obj.options.get('url');
		
	});

export const getBlobFromSrc = ({obj, src, type, quality})=>{
	const options = obj.options;
	const imageElem = document.createElement("img");
	imageElem.src = src;

	const { data, cropData, scaledRatio } = getCroppedImageCanvas({...obj, imageElem});

	const canvasSize = cropData.canvas.get('size');

	const canvas = document.createElement('canvas');
	canvas.width = data.getIn(['size', 'x']);
	canvas.height = data.getIn(['size', 'y']);

	const context = canvas.getContext('2d');
	// context.fillStyle = "blue";
 //    context.fillRect(0, 0, canvas.width, canvas.height);

	if (options.get('fillColor')) {
		context.fillStyle = options.get('fillColor');
		context.fillRect(0, 0, canvasSize.get('x'), canvasSize.get('y'));
	}

	const drawImageParams = getDrawImageParams({imageElem, data, cropData, scaledRatio});
	
	if(typeof IS_TEST === 'undefined'){
		// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.drawImage
		context.drawImage.apply(context,  drawImageParams)
	}
	
	return canvas.toDataURL(type, quality);
}

export const getDrawImageParams = ({ imageElem, cropData, data, scaledRatio})=> {
	const sourceCanvas = getSourceCanvas({
		imageElem, 
		image: cropData.image, 
		canvasData: cropData.canvas
	});

	return [sourceCanvas, ...getDrawImageParamsParams({
		scaledRatio,
		srcPoint: data.get('offset'), 
		originalSize: data.get('size'), 
		sourceSize: pointFromSize(sourceCanvas)
	})];
};

export const getDrawImageParamsParams = ({srcPoint, originalSize, sourceSize, scaledRatio})=>{
	let args = [];
	let dstPoint = zero;
	let srcSize = zero;
	let dstSize = zero;

	if (srcPoint.get('x') <= -originalSize.get('x') ||
		srcPoint.get('x') > sourceSize.get('x')) {
		// srcPoint = srcPoint.set('x', 0);
	} 
	if (srcPoint.get('x') <= 0) {
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
		// srcPoint = srcPoint.set('y', 0);
	}
	 if (srcPoint.get('y') <= 0) {
		dstPoint = dstPoint.set('y', -srcPoint.get('y'));
		srcPoint = srcPoint.set('y', 0);

		const _width = Math.min(sourceSize.get('y'), originalSize.get('y') + srcPoint.get('y'));

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
		Math.floor(srcPoint.get('x')),
		Math.floor(srcPoint.get('y')),
		Math.floor(srcSize.get('x')),
		Math.floor(srcSize.get('y'))
	];

	// Scale destination sizes
	// if (scaledRatio) {
	// 	dstPoint = dstPoint.scaleScalar(scaledRatio);
	// 	dstSize = dstSize.scaleScalar(scaledRatio);
	// }

	// Avoid "IndexSizeError" in IE and Firefox
	if (dstSize.get('x') > 0 && dstSize.get('y') > 0) {
		args = [
			...args,
			Math.floor(dstPoint.get('x')),
			Math.floor(dstPoint.get('y')),
			Math.floor(dstSize.get('x')),
			Math.floor(dstSize.get('y'))
		]
	}
	return args;
}

export const getSourceCanvasPure = ({ image }) => {

	let canvasSize  = image.get('naturalSize')
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
			sizePoint: canvasSize,
			degree: rotate,
			aspectRatio: image.get('aspectRatio')
		});

		canvasSize = rotated;
		translate = rotated.divideScalar(2);
	}

	const offset = true ? image.get('naturalSize').negate().divideScalar(2) : zero;
	
	return {canvasSize, translate, rotate, scale, offset, resize:image.get('naturalSize')};
}

export const getSourceCanvas = ({ imageElem, image, canvasData }) => {
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');

	const {canvasSize, translate, rotate, scale, offset, resize} = getSourceCanvasPure({ 
		imageElem, 
		image
	});

	canvas.width = canvasSize.get('x');
	canvas.height = canvasSize.get('y');

	// context.fillStyle = "red";
	// context.fillRect(0 ,0, canvas.width, canvas.height);

	context.save();
	if(translate) {
		context.translate(translate.get('x'), translate.get('y'));	
	}

	if (rotate) {
		context.rotate(rotate * Math.PI / 180);
	}

	if (scale) {
		context.scale(scale.get('x'), scale.get('y'));
	}

	if(typeof IS_TEST === 'undefined') {
		context.drawImage(imageElem, offset.get('x'), offset.get('y'), resize.get('x'), resize.get('y'));
	}

    context.restore();
    
	return canvas;
};

export const getCroppedImageCanvas = ({ options, cropData, isRounded }) => {
	const data = getData({ options, cropData, isRounded });

	const originalSize = data.get('size');
	const aspectRatio = originalSize.getAspectRatio();
	let scaledSize = pointFromSize({
		width: options.get('width'), 
		height: options.get('height')
	});
	let scaledRatio = null;
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

	return {data, cropData, scaledRatio}
};

export const getData = ({ options, cropData:{image, canvas, cropBox}, isRounded }) => {
	let data = Immutable.fromJS({
		offset: cropBox.get('offset').subtract(canvas.get('offset')),
		size: cropBox.get('size')
	});

	const ratio = image.getIn(['size', 'x']) / image.getIn(['naturalSize', 'x']);

	const onRatio = (point)=> {
		const newPoint = point.divideScalar(ratio);
		return isRounded ? newPoint.updateCoordsOnTransform(Math.round) : newPoint;
	}

	data = data
	.update('offset', onRatio)
	.update('size', onRatio);

	if (options.get('rotatable')) {
		data = data.set('rotate', image.get('rotate') || 0)
	}

	if (options.get('scalable')) {
		data = data.set('scale', image.get('scale') || one)
	}

	return data;
};
