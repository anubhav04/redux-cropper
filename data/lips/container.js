const pointFromSize = require('../../src/records/point').pointFromSize
const  Immutable  = require('immutable')
module.exports = Immutable.fromJS({
	size: pointFromSize({
		"width": 698,
		"height": 516
	})
});
