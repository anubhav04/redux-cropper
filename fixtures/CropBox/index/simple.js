const viewBox = require('../../ViewBox/index/simple.js')
const cropBox = require('../../../data/lips/cropBox.js')

module.exports = {
	options:{
		guides:true, 
		center:true, 
		cropBoxResizable:true
	},
	viewBox,
	cropBox
}
