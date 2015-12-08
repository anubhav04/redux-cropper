import { createAction } from 'redux-actions'

const rotateImage = () => 
	(dispatch, getState)=> {
		const {canvas} = getState();
		dispatch(createAction('ROTATE_IMAGE')({canvas}))
	};

const rotateCanvas = () =>
	(dispatch, getState)=> {
		const {options:_options, container, cropBox, image} = getState();
		dispatch(createAction('ROTATE_CANVAS')({
			options:_options.get('options'), 
			container, 
			cropBox, 
			image
		}))
	};

export const rotate = (degree) =>
	(dispatch, getState)=> {
		console.log(degree)
		dispatch(createAction('SET_ROTATE')(degree))
		dispatch(rotateCanvas())
		dispatch(rotateImage())
	};
