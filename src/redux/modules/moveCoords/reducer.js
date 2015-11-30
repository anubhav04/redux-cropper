import { createAction, handleActions } from 'redux-actions';
import { mergeReducer } from '../utils';
import Immutable from 'immutable';
import { CROP_END, CROP_MOVE, CROP_START } from './constants';

const initialState = Immutable.fromJS({
	start: null,
	end: null,
	action: null
});

export default handleActions({
		CROP_START: mergeReducer,
		CROP_MOVE: mergeReducer,
		CROP_END: (state)=>initialState,
		CROP_UPDATED: (state)=>{
			return state.set('start', state.get('end'))
		}
	},
	initialState
)
