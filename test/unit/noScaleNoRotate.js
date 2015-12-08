import expect from 'expect'
import {
	getOffscreenCroppedImagePromise, 
	getBlobFromSrc,
	getDrawImageParams,
	getDrawImageParamsParams,
	getSourceCanvas,
	getCroppedImageCanvas,
	getSourceCanvasPure,
	getData
} from '../../src/actions/getCroppedCanvas'

const pointFromSize = require('../../src/records/point').pointFromSize
const pointFct = require('../../src/records/point').pointFct
const pointFromOffset = require('../../src/records/point').pointFromOffset
const Immutable  = require('immutable')

const options = Immutable.fromJS({
			url:'http://fengyuanchen.github.io/cropper/img/picture.jpg',
			rotatable: true,
			scalable:true,
			size: pointFromSize({
				width: 720,
				height: 516
			})
		});

const toJS = (obj)=>Immutable.fromJS(obj).toJS()

		const eqIm = (obj1, obj2)=>{
			expect(toJS(obj1)).toEqual(toJS(obj2))
		}


describe('getCroppedCanvas', () => {
	describe('getCroppedCanvas - no scale, no rotate', () => {
		//{"naturalWidth":1280,"naturalHeight":720,"aspectRatio":1.7777777777777777,"width":720,"height":405,"left":0,"oldLeft":0,"top":55.5,"oldTop":55.5,"minWidth":0,"minHeight":0,"maxWidth":null,"maxHeight":null,"minLeft":-720,"minTop":-405,"maxLeft":720,"maxTop":516}
		const image = Immutable.fromJS({
			aspectRatio: 1.7777777777777777,
			naturalSize: pointFromSize({
				width: 1280,
				height: 720
			}),
			size: pointFromSize({
				width: 574.2222222222222,
			    height: 323
			}),
			offset: pointFromOffset({
				left: 0,
			    top: 0
			}),
			scale: pointFct({
				x: 1,
			    y: 1
			}),
			rotate:0
		});

		//{"naturalWidth":1280,"naturalHeight":720,"aspectRatio":1.7777777777777777,"width":574.2222222222222,"height":323,"left":0.38888888888891415,"oldLeft":0.38888888888891415,"top":0,"oldTop":0,"minWidth":0,"minHeight":0,"maxWidth":null,"maxHeight":null,"minLeft":-574.2222222222222,"minTop":-323,"maxLeft":575,"maxTop":323}
		const canvas = Immutable.fromJS({
			size: pointFromSize({
				width:574.2222222222222,
				height:323
			}),
			offset: pointFromOffset({
				left: 0.38888888888891415,
				top: 0,
			})
		});

		// {"width":459.37777777777774,"height":258.40000000000003,"minWidth":0,"minHeight":0,"maxWidth":574.2222222222222,"maxHeight":323,"minLeft":0,"minTop":0,"maxLeft":115.62222222222226,"maxTop":64.59999999999997,"left":57.81111111111113,"oldLeft":57.81111111111113,"top":32.29999999999998,"oldTop":32.29999999999998}
		const cropBox = Immutable.fromJS({
			size: pointFromSize({
				width: 459.37777777777774,
				height: 258.40000000000003
			}),
			offset: pointFromOffset({
				left: 57.81111111111113,
				top: 32.29999999999998
			})
		});

		//{"x":128,"y":71.99999999999997,"width":1024,"height":576.0000000000001,"rotate":0,"scaleX":1,"scaleY":1}
		const data = Immutable.fromJS({
		  offset: pointFct({
		    x: 127.99999999999999,
		    y: 71.99999999999996
		  }),
		  rotate: 0,
		  scale: pointFct({
		    x: 1,
		    y: 1
		  }),
		  size: pointFct({
		    x: 1023.9999999999999,
		    y: 576.0000000000001
		  })
		})

		const cropData = {image, canvas, cropBox}

		// {"width":576,"height":324,"minWidth":0,"minHeight":0,"maxWidth":720,"maxHeight":405,"minLeft":0,"minTop":0,"maxLeft":144,"maxTop":192,"left":72,"oldLeft":72,"top":96,"oldTop":96}

	  it('getOffscreenCroppedImagePromise', (cb) => {
	  	try{
	  		getOffscreenCroppedImagePromise({ options, cropData, isRounded:false })
		  	.then((obj)=>{
		  		console.log(obj);
		  		cb()	
		  	})
		  	.catch((err)=> console.error(err))
	  	} catch(ex){
	  		console.error(ex);
	  	}
	  })

	  it('getDrawImageParamsParams', () => {
	  	eqIm(getDrawImageParamsParams({
	  		srcPoint: data.get('offset'),
		  	originalSize: canvas.get('size'),
		  	sourceSize: image.get('naturalSize'),
		  	scaledRatio: 0
		  }), [
		  	Math.floor(data.getIn(['offset', 'x'])),
		  	Math.floor(data.getIn(['offset', 'y'])),
	        Math.floor(canvas.getIn(['size', 'x'])),
	        Math.floor(canvas.getIn(['size', 'y'])),
	        0,
	        0,
	        Math.floor(canvas.getIn(['size', 'x'])),
	        Math.floor(canvas.getIn(['size', 'y']))
	       ])
	  })
	  it('getSourceCanvasPure', () => {
	  	eqIm(getSourceCanvasPure({ image }), 
	    {
	    	canvasSize: image.get('naturalSize'),
	    	translate: null,
	    	rotate: 0,
	    	scale: {
	    		x: 1, 
	    		y: 1
	    	},
	    	offset: {
	    		x: 0, 
	    		y: 0
	    	},
	    	resize: image.get('naturalSize')
	    })	
	  })
	  it('getCroppedImageCanvas', () => {
	  	eqIm(getCroppedImageCanvas({ options, cropData, isRounded:false }), 
	    {
	        cropData,
	        data,
	        scaledRatio: null
	    })
	  })

	  it('getData', () => {
	  	eqIm(getData({ options, cropData, isRounded:false }), data)
	  })

	  it('getBlobFromSrc', () => {
	  	const res = getBlobFromSrc({ 
	  		obj:{
		  		options,
		  		cropData
		  	}, 
			src: options.get('url'), 
			type: "image/png", 
			quality: 1 
		})
	  })
	})

	describe('getCroppedCanvas - scale', () => {
		// {"naturalWidth":1280,"naturalHeight":720,"aspectRatio":1.7777777777777777,"width":240.60748539762838,"height":135.34171053616595,"left":0,"top":0}
		const image = Immutable.fromJS({
			aspectRatio: 1.7777777777777777,
			naturalSize: pointFromSize({
				width: 1280,
				height: 720
			}),
			size: pointFromSize({
				width: 240.60748539762838,
			    height: 135.34171053616595
			}),
			offset: pointFromOffset({
				left: 0,
			    top: 0
			}),
			scale: pointFct({
				x: 1,
			    y: 1
			}),
			rotate:0
		});

		//{"naturalWidth":1280,"naturalHeight":720,"aspectRatio":1.7777777777777777,"width":240.60748539762838,"height":135.34171053616595,"left":223.69625730118582,"oldLeft":223.69625730118582,"top":125.40199241403614,"oldTop":125.40199241403614,"minWidth":0,"minHeight":0,"maxWidth":null,"maxHeight":null,"minLeft":-240.60748539762838,"minTop":-135.34171053616595,"maxLeft":688,"maxTop":387}
		const canvas = Immutable.fromJS({
			size: pointFromSize({
				width:240.60748539762838,
				height:135.34171053616595
			}),
			offset: pointFromOffset({
				left: 223.69625730118582,
				top: 125.40199241403614,
			})
		});

		// {"width":549.1849889624725,"height":308.9165562913908,"minWidth":0,"minHeight":0,"maxWidth":688,"maxHeight":387,"minLeft":0,"minTop":0,"maxLeft":138.81501103752748,"maxTop":78.0834437086092,"left":69.40750551876381,"oldLeft":69.40750551876381,"top":38.61456953642386,"oldTop":38.61456953642386}
		const cropBox = Immutable.fromJS({
			size: pointFromSize({
				width: 549.1849889624725,
				height: 308.9165562913908
			}),
			offset: pointFromOffset({
				left: 69.40750551876381,
				top: 38.61456953642386
			})
		});

		//{"naturalWidth":1280,"naturalHeight":720,"aspectRatio":1.7777777777777777,"width":240.60748539762838,"height":135.34171053616595,"left":0,"top":0}
		const data = Immutable.fromJS({
		   offset: pointFct({
		    x: -820.7957535283182,
		    y: -461.69761135967843
		  }),
		  rotate: 0,
		  scale: pointFct({
		    x: 1,
		    y: 1
		  }),
		  size: pointFct({
		    x: 2921.591507056637,
		    y: 1643.3952227193583
		  })
		})
		
		const cropData = {image, canvas, cropBox}
	  it('getOffscreenCroppedImagePromise', (cb) => {
	  	try{
	  		getOffscreenCroppedImagePromise({ options, cropData, isRounded:false })
		  	.then((obj)=>{
		  		console.log(obj);
		  		cb()	
		  	})
		  	.catch((err)=> console.error(err))
	  	} catch(ex){
	  		console.error(ex);
	  	}
	  })

	  it('getDrawImageParamsParams', () => {
	  	eqIm(getDrawImageParamsParams({
	  		srcPoint: data.get('offset'),
		  	originalSize: data.get('size'),
		  	sourceSize: image.get('naturalSize'),
		  	scaledRatio: 0
		  }), [
		  	0,
		  	0,
	        1280,
	        720,
	        820,
	        461,
	        1280,
	        720,
	       ])
	  })
	  it('getSourceCanvasPure', () => {
	  	eqIm(getSourceCanvasPure({ image }), 
	    {
	    	canvasSize: image.get('naturalSize'),
	    	translate: null,
	    	rotate: 0,
	    	scale: {
	    		x: 1, 
	    		y: 1
	    	},
	    	offset: {
	    		x: 0, 
	    		y: 0
	    	},
	    	resize: image.get('naturalSize')
	    })	
	  })
	  it('getCroppedImageCanvas', () => {
	  	eqIm(getCroppedImageCanvas({ options, cropData, isRounded:false }), 
	    {
	        cropData,
	        data,
	        scaledRatio: null
	    })
	  })

	  it('getData', () => {
	  	eqIm(getData({ options, cropData, isRounded:false }), data)
	  })

	  it('getBlobFromSrc', () => {
	  	const res = getBlobFromSrc({ 
	  		obj:{
		  		options,
		  		cropData
		  	}, 
			src: options.get('url'), 
			type: "image/png", 
			quality: 1 
		})
	  })
	})

describe('getCroppedCanvas - rotate', () => {
		//{"naturalWidth":1280,"naturalHeight":720,"aspectRatio":1.7777777777777777,"width":574.9999999999999,"height":323.43749999999994,"left":-125.78124999999994,"top":-70.75195312499997,"rotate":90}
		const image = Immutable.fromJS({
			aspectRatio: 1.7777777777777777,
			naturalSize: pointFromSize({
				width: 1280,
				height: 720
			}),
			size: pointFromSize({
				width: 574.2222222222221,
			    height: 323.43749999999994
			}),
			offset: pointFromOffset({
				left: -125.78124999999994,
			    top: -70.75195312499997
			}),
			scale: pointFct({
				x: 1,
			    y: 1
			}),
			rotate:90
		});

		//{"naturalWidth":1280,"naturalHeight":720,"aspectRatio":1.7777777777777777,"width":323.4375,"height":181.93359375,"left":125.78125000000001,"oldLeft":125.78125000000001,"top":-81.45833333333329,"oldTop":-81.45833333333329,"minWidth":0,"minHeight":0,"maxWidth":null,"maxHeight":null,"minLeft":-323.4375,"minTop":-181.93359375,"maxLeft":575,"maxTop":323}
		const canvas = Immutable.fromJS({
			size: pointFromSize({
				width:323.4375,
				height:181.93359375
			}),
			offset: pointFromOffset({
				left: 126,
				top: -125.61111111111103,
			})
		});

		// {"width":460,"height":258.75,"minWidth":0,"minHeight":0,"maxWidth":574.2222222222222,"maxHeight":323,"minLeft":0,"minTop":0,"maxLeft":115,"maxTop":64.25,"left":57.5,"oldLeft":57.5,"top":64.25,"oldTop":64.25}
		const cropBox = Immutable.fromJS({
			size: pointFromSize({
				width: 460,
				height: 258.75
			}),
			offset: pointFromOffset({
				left: 57.81111111111113,
				top: 32.29999999999998
			})
		});

		//{"x":-152,"y":351.9999999999999,"width":1024.0000000000002,"height":576.0000000000002,"rotate":90,"scaleX":1,"scaleY":1}
		const data = Immutable.fromJS({
		   offset: pointFct({
		    x: -152,
		    y: 351.99999999999994
		  }),
		  rotate: 90,
		  scale: pointFct({
		    x: 1,
		    y: 1
		  }),
		  size: pointFct({
		    x: 1025.3869969040252,
		    y: 576.7801857585141
		  })
		})
		
		const cropData = {image, canvas, cropBox}
	  it('getOffscreenCroppedImagePromise', (cb) => {
	  	try{
	  		getOffscreenCroppedImagePromise({ options, cropData, isRounded:false })
		  	.then((obj)=>{
		  		console.log(obj);
		  		cb()	
		  	})
		  	.catch((err)=> console.error(err))
	  	} catch(ex){
	  		console.error(ex);
	  	}
	  })

	  it('getDrawImageParamsParams', () => {
	  	eqIm(getDrawImageParamsParams({
	  		srcPoint: data.get('offset'),
		  	originalSize: data.get('size'),
		  	sourceSize: pointFct({
				x: 720.0000000000001,
			    y: 1280
			}),
		  	scaledRatio: 0
		  }), [
		  	0,
		  	351,
	        720,
	        576,
	        152,
	        0,
	        720,
	        576,
	       ])
	  })
	  it('getSourceCanvasPure', () => {
	  	eqIm(getSourceCanvasPure({ image }), 
	    {
	    	canvasSize: pointFct({
				x: 720.0000000000001,
			    y: 1280
			}),
	    	translate: pointFct({
				x: 360.00000000000006,
			    y: 640
			}),
	    	rotate: 90,
	    	scale: {
	    		x: 1, 
	    		y: 1
	    	},
	    	offset: {
	    		x: -640, 
	    		y: -360
	    	},
	    	resize: pointFct({
				x: 720.0000000000001,
			    y: 1280
			})
	    })	
	  })
	  it('getCroppedImageCanvas', () => {
	  	eqIm(getCroppedImageCanvas({ options, cropData, isRounded:false }), 
	    {
	        cropData,
	        data,
	        scaledRatio: null
	    })
	  })

	  it('getData', () => {
	  	eqIm(getData({ options, cropData, isRounded:false }), data)
	  })

	  it('getBlobFromSrc', () => {
	  	const res = getBlobFromSrc({ 
	  		obj:{
		  		options,
		  		cropData
		  	}, 
			src: options.get('url'), 
			type: "image/png", 
			quality: 1 
		})
	  })
	})
})

// {"width":576,"height":324,"minWidth":0,"minHeight":0,"maxWidth":720,"maxHeight":405,"minLeft":0,"minTop":0,"maxLeft":144,"maxTop":192,"left":72,"oldLeft":72,"top":96,"oldTop":96}
// cropper.js:2132 image
// cropper.js:2133 {"naturalWidth":1280,"naturalHeight":720,"aspectRatio":1.7777777777777777,"width":719.9999999999999,"height":404.99999999999994,"left":-157.49999999999994,"top":157.49999999999997,"rotate":90}
// cropper.js:2134 canvas
// cropper.js:2135 {"naturalWidth":720.0000000000001,"naturalHeight":1280,"aspectRatio":0.5625000000000001,"width":405,"height":719.9999999999999,"left":157.5,"oldLeft":157.5,"top":-101.99999999999994,"oldTop":-101.99999999999994,"minWidth":0,"minHeight":0,"maxWidth":null,"maxHeight":null,"minLeft":-405,"minTop":-719.9999999999999,"maxLeft":720,"maxTop":516}
// cropper.js:2419 data
// cropper.js:2420 {"x":-152.00000000000003,"y":351.99999999999994,"width":1024.0000000000002,"height":576.0000000000001,"rotate":90,"scaleX":1,"scaleY":1}
// cropper.js:2444 canvasWidth
// cropper.js:2445 1024
// cropper.js:2446 canvasHeight
// cropper.js:2447 576
// cropper.js:211 <getSourceCanvas>
// cropper.js:212 image
// cropper.js:213 {}
// cropper.js:214 data
// cropper.js:215 {"naturalWidth":1280,"naturalHeight":720,"aspectRatio":1.7777777777777777,"width":719.9999999999999,"height":404.99999999999994,"left":-157.49999999999994,"top":157.49999999999997,"rotate":90}
