import React from 'react';
import PureComponent from 'react-pure-render/component';

const imgPath = require("../img/watson.jpg");

import { getBlob, CropperFct, CropperPreview, imageUtils } from 'redux-cropper';
const { getBlobFromUrl } = imageUtils;

const Cropper = CropperFct({isDebug: true});

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
		width: 300,
		height: 300
	},
	url: 'data:image/png;base64,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'
};

getBlobFromUrl('https://avatars3.githubusercontent.com/u/154949?v=3&s=460')
.then(console.log.bind(console))

export default class App extends PureComponent {
	constructor(props, context) {
		super(props, context);
		this.state = {rotate: 0};
		this.onCropperReduxUpdate = this.onCropperReduxUpdate.bind(this);
	}

	onCropperReduxUpdate() {
		const {image, cropBox, myState, canvas} = this.state.cropperRedux.getState();
		if (!myState.get('isInited')) {
			return;
		}
		this.setState({image, cropBox, canvas});

		if (this.state.blob) {
			this.state.cropperRedux.dispatch(getBlob((blob)=>this.setState({
				testImg: blob
			})));
		}
	}

	render() {
		return (
			<div>
				<div style={{width:800, height:30}}>
					<input
						type="checkbox"
						checked={this.state.blob}
						onChange={()=>{
						this.setState({blob:!this.state.blob})
					}}
					/>
					{this.state.blob ? 'Get and set blob to img on each change (slow)' : 'Get cropper data and set previews (fast)'}
					<br/>
					<input type="range"
								 min="0"
								 max="360"
								 style={{width:800, height:30}}
								 value={this.state.range}
								 step="1"
								 onChange={(event)=>{
						this.setState({rotate:parseInt(event.target.value)})
					}}/>
					<br/>
					{this.state.rotate}

				</div>
				<br/>
				<br/>
				<div style={{display:'inline-block'}}>
					<Cropper {...options}
						rotate={this.state.rotate}
						onRedux={(cropperRedux)=>{
							this.setState({cropperRedux});
							cropperRedux.subscribe(this.onCropperReduxUpdate)
						}}/>
				</div>
				{this.state.blob ? (
					<div style={{display:'inline-block'}}>
						<br/>
						<img src={this.state.testImg}/>
					</div>
				) : (
					<div style={{display:'inline-block'}}>
						<br/>
						<CropperPreview url={options.url}
														divSize={{width:100, height:70}}
														image={this.state.image}
														cropBox={this.state.cropBox}/>

						<CropperPreview url={options.url}
														divSize={{width:200, height:140}}
														image={this.state.image}
														cropBox={this.state.cropBox}/>
					</div>
				)}

				<br/>
				image : {this.state.image ? JSON.stringify(this.state.image) : null}
				<br/>
				canvas : {this.state.canvas ? JSON.stringify(this.state.canvas) : null}
				<br/>
				cropbox : {this.state.cropBox ? JSON.stringify(this.state.cropBox) : null}
				<br/>

			</div>
		);
	}
}

