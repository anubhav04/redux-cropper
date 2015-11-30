const image = require('../../../data/lips/image.js')
const cropBox = require('../../../data/lips/cropBox.js')

image.rotate = 1;

module.exports = {
	image,
	// cropbox transform param
	cropBox,
	// final size of elem
	divSize: {
		width: 263,
		height: 147.938
	},
	url: 'http://fengyuanchen.github.io/cropper/img/picture.jpg'
}