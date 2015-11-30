import { createAction, handleActions } from 'redux-actions';
import R from 'ramda'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	isInited: false,
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
});

export default handleActions({
		NEW_MY_STATE: (state, {payload}) => R.reduce((oldState, [name, value])=>{
			return oldState.set(name, value)
		})(state, R.toPairs(payload))
	},
	initialState
)
