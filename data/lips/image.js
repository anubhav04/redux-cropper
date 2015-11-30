const pointFromSize = require('../../src/records/point').pointFromSize
const pointFct = require('../../src/records/point').pointFct
const pointFromOffset = require('../../src/records/point').pointFromOffset
const  Immutable  = require('immutable')

module.exports = Immutable.fromJS({
	"aspectRatio": 1.7777777777777777,
	naturalSize: pointFromSize({
		"width": 1280,
		"height": 720
	}),
	size: pointFromSize({
		"width": 697.1539393939408,
			"height": 392.14909090909174
	}),
	offset: pointFromOffset({
		"left": 0,
			"top": 0
	}),
	scale: pointFct({
		 "x": 1,
	    "y": 1
	}),
	"rotate":0
});

