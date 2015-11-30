import React, { Component } from 'react';

import CropperFct from 'redux-cropper';
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

export default class App extends Component {
	render() {
		return (
			<Cropper {...options}/>
		);
	}
}

