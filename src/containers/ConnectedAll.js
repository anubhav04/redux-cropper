import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect'
import { CanvasSelector, CropBoxSelector, ImageSelector, optionsSelector, containerSelector} from '../selectors';
import { newOptions } from '../redux/modules/options';
import * as actionDirections from '../redux/modules/cropbox/direction';
import * as dragboxActions from '../redux/modules/dragbox';
import * as moveCoordsActions from '../redux/modules/moveCoords/actions';
import * as handlers from '../actions/handlers';
import ImageContainer from '../components/ImageContainer';
import { pointFromSize, pointFct, pointFromOffset } from '../records/point';

const allSelector = createStructuredSelector({
	testImg: (state)=>state.test,
	canvasData: (state)=>state.canvas,
	containerData: (state)=>state.container,
	cropBoxData: (state)=>state.cropBox,
	imageData: (state)=>state.image,
	_options: optionsSelector
});

class ConnectedAll extends Component {
	componentDidMount() {
		this.componentWillReceiveProps(this.props)
	}

	componentWillReceiveProps(nextProps) {
		const { newOptions, options } = nextProps;
		if(options.disableOptions){
			return;
		}
	
		newOptions(options);
	}

	render() {
		const {
			canvasData,
			containerData,
			_options,
			cropBoxData,
			imageData,
			actionEast,
			actionWest,
			actionSouth,
			actionNorth,
			actionSouthEast,
			actionSouthWest,
			actionNorthEast,
			actionNorthWest,
			wheel,
			cropStart,
			cropMove,
			cropEnd
		} = this.props;

		const actionDirections = {
			actionEast,
			actionWest,
			actionSouth,
			actionNorth,
			actionSouthEast,
			actionSouthWest,
			actionNorthEast,
			actionNorthWest
		};

		const handlers = {
			wheel
		};

		const cropperActions = {
			cropStart,
			cropMove,
			cropEnd
		};

		if(!_options.get('lastPassedOptions')){
			return <div/>;
		}

		const {guides, center, cropBoxResizable, url} = _options.get('options').toJS();

		const container = Immutable.fromJS({
			wrapBox: {
				canvas: canvasData,
				image: imageData,
				url: url
			},
			cropBox: {
				options: {
					guides,
					center,
					cropBoxResizable
				},
				viewBox: {
					canvasOffset: canvasData.get('offset'),
					cropBoxOffset: cropBoxData.get('offset'),
					image: imageData,
					url: url
				},
				cropBox: cropBoxData
			},
			container: containerData
		});

		// console.log('canvas:')
		// console.log(canvas.toJS())
		// console.log('=>canvas')

		// console.log('cropBox:')
		// console.log(cropBox)
		// console.log('=>cropBox')

		// console.log('image:')
		// console.log(image)
		// console.log('=>image')

		if(!_options.get('lastPassedOptions')){
			return <div/>;
		}

		return (
				<ImageContainer
					handlers={handlers}
					cropperActions={cropperActions}
					options={_options.toJS()}
					style={{}}
					container={container}
					actionDirections={actionDirections}/>
		);
	}
}

export default connect(
	allSelector,
	{
		...actionDirections,
		newOptions,
		...handlers,
		...moveCoordsActions,
		...dragboxActions
	}
)(ConnectedAll);
