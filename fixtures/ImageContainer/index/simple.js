const container = require('../../Container/index/simple.js')

module.exports = {
	container,
	cropperActions:{
		cropStart:()=>{},
		cropMove:()=>{},
		cropEnd:()=>{}
	},
	handlers:{
		wheel:()=>{}
	}
}

console.log(JSON.stringify(container))
