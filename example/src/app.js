import React from 'react';
import PureComponent from 'react-pure-render/component';

const imgPath = require("../img/watson.jpg");

import { getBlob, Cropper, CropperPreview, imageUtils } from 'redux-cropper';
const { getBlobFromUrl } = imageUtils;

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
	url: 'data:image/gif;base64,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'
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

		if (this.state.isBlobMode) {
			this.state.cropperRedux.dispatch(getBlob((blob)=>this.setState({
				croppedImg: blob
			})));
		}
	}

	render() {
		const {rotate, isBlobMode, range, croppedImg, croppedImg1} = this.state;

		return (
			<div>
				<div style={{width:800, height:30}}>
					<input
						type="checkbox"
						checked={isBlobMode}
						onChange={()=>{this.setState({isBlobMode:!isBlobMode})}}
					/>
					{isBlobMode ? 'Get and set blob to img on each change (slow)' : 'Get cropper data and set previews (fast)'}
					<br/>
					<input type="range"
								 min="0"
								 max="360"
								 style={{width:800, height:30}}
								 value={range}
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
					<Cropper
						options={{...options, rotate}}
						reduxOptions={{isDebug:true}}
						onRedux={(cropperRedux)=>{
							this.setState({cropperRedux});
							cropperRedux.subscribe(this.onCropperReduxUpdate)
						}}/>
					{isBlobMode ? <Cropper options={{...options, url: croppedImg}}/> : null}
				</div>
				{isBlobMode ? 
				(<div style={{display:'inline-block'}}>
					<br/>
					<img src={croppedImg}/>
				</div>) : 
				(<div style={{display:'inline-block'}}>
					<br/>
					<CropperPreview url={options.url}
									divSize={{width:100, height:70}}
									image={this.state.image}
									cropBox={this.state.cropBox}/>
					<CropperPreview url={options.url}
									divSize={{width:200, height:140}}
									image={this.state.image}
									cropBox={this.state.cropBox}/>
				</div>)
				}

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

