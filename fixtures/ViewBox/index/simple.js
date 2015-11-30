const image = require('../../../data/lips/image.js')
const canvas = require('../../../data/lips/canvas.js')
const cropBox = require('../../../data/lips/cropBox.js')

module.exports = {
	canvasOffset: canvas.get('offset'),
	cropBoxOffset: cropBox.get('offset'),
	image,
	url: 'http://fengyuanchen.github.io/cropper/img/picture.jpg'
}
