const pointFromSize = require('../../src/records/point').pointFromSize
const pointFromOffset = require('../../src/records/point').pointFromOffset
const  Immutable  = require('immutable')

module.exports = Immutable.fromJS({
	size: pointFromSize({
		width: 697.1539393939408,
		height: 392.14909090909174
	}),
	offset: pointFromOffset({
		left: 0.4230303030295204,
		top: -4.831690603168681e-13
	})
});
