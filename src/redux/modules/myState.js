import { createAction, handleActions } from 'redux-actions';
import R from 'ramda'

const initialState = {
	isLoaded: false,
	isCompleted: false,
	isRotated: false,
	isCropped: false,
	isDisabled: false,
	isReplaced: false,
	isLimited: false,
	isImg: false,
	originalUrl: '',
	crossOrigin: '',
	canvas: null,
	cropBox: null
};

const updateOption = (state, name, value)=> {
	let newValue = value;

	return state.set(name, newValue);
};

export default handleActions({
		NEW_MY_STATE: (state, payload) => R.reduce((oldState, {name, value})=>updateOption(oldState, name, value))(state, payload)
	},
	initialState
)
