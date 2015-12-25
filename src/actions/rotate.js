import { createAction } from 'redux-actions'

const rotateImage = () => 
	(dispatch, getState)=> {
		const {canvas} = getState();
		dispatch(createAction('ROTATE_IMAGE')({canvas}))
	};

const rotateCanvas = () =>
	(dispatch, getState)=> {
		const {options, container, cropBox, image} = getState();
		dispatch(createAction('ROTATE_CANVAS')({
			options, 
			container, 
			cropBox, 
			image
		}))
	};

export const rotate = (degree) =>
	(dispatch, getState)=> {
		dispatch(createAction('SET_ROTATE')(degree))
		dispatch(rotateCanvas())
		dispatch(rotateImage())
	};
