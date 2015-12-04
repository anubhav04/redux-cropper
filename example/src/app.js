import React from 'react';
import PureComponent from 'react-pure-render/component';

const imgPath = require("../img/watson.jpg");

import { getBlob, CropperFct, CropperPreview } from 'redux-cropper';
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
		width: 500,
		height: 300
	},
	url: imgPath
};

export default class App extends PureComponent {
	constructor(props, context) {
		super(props, context);
		this.state = {rotate: 0};
		this.onCropperReduxUpdate = this.onCropperReduxUpdate.bind(this);
	}

	onCropperReduxUpdate() {
		const {image, cropBox, myState} = this.state.cropperRedux.getState();
		if (!myState.get('isInited')) {
			return;
		}
		this.setState({image, cropBox});

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
					{this.state.blob ? 'Get and set blob to img on each change (slow) and only works correct on angle % 90 === 0 for now' : 'Get cropper data and set previews (fast)'}
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

			</div>
		);
	}
}

