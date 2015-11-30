import React from 'react';
import PureComponent from 'react-pure-render/component';

import { getBlob, CropperFct, CropperPreview } from 'redux-cropper';
const Cropper = CropperFct({isDebug:true});

const options = {
	viewMode: 1,
	wheelZoomRatio: 0.5,
	aspectRatio: null,
	dragMode: 'move',
	autoCropArea: 1,
	modal: true,
	guides: true,
	highlight: false,
	cropBoxMovable: false,
	cropBoxResizable: true,
	size: {
		width: 500,
		height: 500
	},
	rotate: 90,
	url: 'http://fengyuanchen.github.io/cropper/img/picture.jpg'
};

export default class App extends PureComponent {
	constructor(props, context) {
		super(props, context);
		this.state = {};
		this.onCropperReduxUpdate = this.onCropperReduxUpdate.bind(this);
	}

	onCropperReduxUpdate(){
		const {image, cropBox, myState} = this.state.cropperRedux.getState();
		if(!myState.get('isInited')){
			return;
		}
		this.setState({image, cropBox});

		//this.state.cropperRedux.dispatch(getBlob((blob)=>this.setState({
		//	testImg: blob
		//})));
	}

	render() {
		return (
			<div>
				<Cropper {...options} onRedux={(cropperRedux)=>{
					this.setState({cropperRedux});
					cropperRedux.subscribe(this.onCropperReduxUpdate)
				}}/>
				<CropperPreview url={options.url}
												divSize={{width:100, height:70}}
												image={this.state.image}
												cropBox={this.state.cropBox}/>

				<CropperPreview url={options.url}
												divSize={{width:200, height:140}}
												image={this.state.image}
												cropBox={this.state.cropBox}/>
			</div>
		);
	}
}

