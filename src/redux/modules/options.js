import { createAction, handleActions } from 'redux-actions';
import R from 'ramda'
import Immutable from 'immutable'
import { init } from '../../actions/init'
import { rotate } from '../../actions/rotate'
import { pointFromSize } from '../../records/point';
