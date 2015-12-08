const pointFromSize = require('../../src/records/point').pointFromSize
const pointFromOffset = require('../../src/records/point').pointFromOffset
const Immutable  = require('immutable')
module.exports = Immutable.fromJS({
	size: pointFromSize({
		width: 82.08888888888887,
		height: 46.175
	}),
	offset: pointFromOffset({
		left: 453.9111111111111,
		top: 144.10416072319222
	})
});
